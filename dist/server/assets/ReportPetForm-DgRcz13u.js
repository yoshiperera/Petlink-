import { a as supabase, i as VIDEO_BUCKET, n as useAuth, r as PHOTO_BUCKET } from "./MainLayout-Q0ocpr4O.js";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { UploadCloud } from "lucide-react";
//#region src/lib/matching.ts
var ML_API_URL = "http://localhost:8000";
var ML_API_KEY = "petlink-secret-2026";
async function notifyPotentialMatches(report) {
	const endpoint = report.type === "lost" ? "embed-lost" : "match-found";
	try {
		const res = await fetch(`${ML_API_URL}/${endpoint}/${report.id}`, {
			method: "POST",
			headers: { "x-api-key": ML_API_KEY }
		});
		if (!res.ok) {
			console.error(`[matching] ${endpoint} failed:`, await res.text());
			return;
		}
	} catch (err) {
		console.error(`[matching] could not reach ML service:`, err);
	}
}
//#endregion
//#region src/components/pets/ReportPetForm.tsx
var inputCls = "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
var ALLOWED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp"
];
var MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
var ALLOWED_VIDEO_TYPES = [
	"video/mp4",
	"video/webm",
	"video/quicktime",
	"video/x-matroska"
];
var MAX_VIDEO_SIZE_BYTES = 45 * 1024 * 1024;
function Field({ label, children }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "block",
		children: [/* @__PURE__ */ jsx("span", {
			className: "mb-1.5 block text-sm font-semibold text-foreground",
			children: label
		}), children]
	});
}
/**
* Generates a client-side id. Used both for storage upload paths and, for
* found reports, as the pet_reports row id itself - since that insert can't
* use .select() to read the id back afterwards (see handleSubmit below).
*/
function generateId() {
	if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
	return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
/**
* Grabs a single still from the uploaded video.
*
* The AI matcher compares images, not video, so a found report needs a frame to
* put beside the lost report's photo. Doing it here in the browser means the
* server never has to decode video.
*/
async function extractVideoFrame(file) {
	const objectUrl = URL.createObjectURL(file);
	const video = document.createElement("video");
	video.muted = true;
	video.playsInline = true;
	video.preload = "metadata";
	video.src = objectUrl;
	try {
		await new Promise((resolve, reject) => {
			video.onloadedmetadata = () => {
				video.currentTime = Math.min(1, (video.duration || 1) / 2);
			};
			video.onseeked = () => resolve();
			video.onerror = () => reject(/* @__PURE__ */ new Error("Could not read the video"));
			setTimeout(() => reject(/* @__PURE__ */ new Error("Timed out reading the video")), 1e4);
		});
		if (!video.videoWidth || !video.videoHeight) return null;
		const canvas = document.createElement("canvas");
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const context = canvas.getContext("2d");
		if (!context) return null;
		context.drawImage(video, 0, 0, canvas.width, canvas.height);
		const blob = await new Promise((resolve) => {
			canvas.toBlob((result) => resolve(result), "image/jpeg", .9);
		});
		if (!blob) return null;
		return new File([blob], `frame-${Date.now()}.jpg`, { type: "image/jpeg" });
	} catch {
		return null;
	} finally {
		URL.revokeObjectURL(objectUrl);
	}
}
async function uploadToBucket(bucket, file) {
	const extension = file.name.split(".").pop() ?? "bin";
	const path = `${generateId()}.${extension}`;
	const { error } = await supabase.storage.from(bucket).upload(path, file, {
		contentType: file.type,
		upsert: false
	});
	if (error) throw error;
	if (bucket === "pet-videos") return path;
	return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
function ReportPetForm({ kind }) {
	const { user } = useAuth();
	const [submitted, setSubmitted] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState(null);
	const [petName, setPetName] = useState("");
	const [breed, setBreed] = useState("");
	const [color, setColor] = useState("");
	const [lastSeenLocation, setLastSeenLocation] = useState("");
	const [description, setDescription] = useState("");
	const [contactInfo, setContactInfo] = useState("");
	const [foundStatus, setFoundStatus] = useState("");
	const [petPhoto, setPetPhoto] = useState(null);
	const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
	const [uploadError, setUploadError] = useState(null);
	const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
	const [petVideo, setPetVideo] = useState(null);
	const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
	const [isDraggingVideo, setIsDraggingVideo] = useState(false);
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [isStartingCamera, setIsStartingCamera] = useState(false);
	const photoInputRef = useRef(null);
	const videoInputRef = useRef(null);
	const cameraVideoRef = useRef(null);
	const mediaStreamRef = useRef(null);
	const pendingCameraStreamRef = useRef(null);
	const isFoundReport = kind === "found";
	useEffect(() => {
		if (!petPhoto) {
			setPhotoPreviewUrl(null);
			return;
		}
		const previewUrl = URL.createObjectURL(petPhoto);
		setPhotoPreviewUrl(previewUrl);
		return () => {
			URL.revokeObjectURL(previewUrl);
		};
	}, [petPhoto]);
	useEffect(() => {
		if (!petVideo) {
			setVideoPreviewUrl(null);
			return;
		}
		const previewUrl = URL.createObjectURL(petVideo);
		setVideoPreviewUrl(previewUrl);
		return () => {
			URL.revokeObjectURL(previewUrl);
		};
	}, [petVideo]);
	useEffect(() => {
		return () => {
			if (mediaStreamRef.current) {
				mediaStreamRef.current.getTracks().forEach((track) => track.stop());
				mediaStreamRef.current = null;
			}
			if (pendingCameraStreamRef.current) {
				pendingCameraStreamRef.current.getTracks().forEach((track) => track.stop());
				pendingCameraStreamRef.current = null;
			}
		};
	}, []);
	useLayoutEffect(() => {
		if (!isCameraOpen) return;
		const video = cameraVideoRef.current;
		const stream = pendingCameraStreamRef.current;
		if (!video || !stream) return;
		mediaStreamRef.current = stream;
		pendingCameraStreamRef.current = null;
		video.srcObject = stream;
		video.play();
	}, [isCameraOpen]);
	const title = kind === "lost" ? "Report a Lost Pet" : "Report a Found Pet";
	const subtitle = kind === "lost" ? "Share details about your missing pet so our community can help bring them home." : "Help us reunite a found pet with their family. Share what you know.";
	const getPhotoValidationError = (file) => {
		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return "Only JPG, JPEG, PNG, and WEBP images are allowed.";
		if (file.size > MAX_IMAGE_SIZE_BYTES) return "Image size must be 5MB or smaller.";
		return null;
	};
	const getVideoValidationError = (file) => {
		if (!ALLOWED_VIDEO_TYPES.includes(file.type)) return "Only MP4, WEBM, MOV, and MKV videos are allowed.";
		if (file.size > MAX_VIDEO_SIZE_BYTES) return "Video size must be 45MB or smaller.";
		return null;
	};
	const handlePhotoSelect = (file) => {
		if (!file) return;
		const validationError = getPhotoValidationError(file);
		if (validationError) {
			setUploadError(validationError);
			setPetPhoto(null);
			return;
		}
		setUploadError(null);
		setPetPhoto(file);
	};
	const handleVideoSelect = (file) => {
		if (!file) return;
		const validationError = getVideoValidationError(file);
		if (validationError) {
			setUploadError(validationError);
			setPetVideo(null);
			return;
		}
		setUploadError(null);
		setPetVideo(file);
	};
	const handlePhotoInputChange = (event) => {
		handlePhotoSelect(event.target.files?.[0] ?? null);
	};
	const handleVideoInputChange = (event) => {
		handleVideoSelect(event.target.files?.[0] ?? null);
		event.target.value = "";
	};
	const handlePhotoDrop = (event) => {
		event.preventDefault();
		setIsDraggingPhoto(false);
		handlePhotoSelect(event.dataTransfer.files?.[0] ?? null);
	};
	const handleVideoDrop = (event) => {
		event.preventDefault();
		setIsDraggingVideo(false);
		handleVideoSelect(event.dataTransfer.files?.[0] ?? null);
	};
	const openCamera = async () => {
		if (!navigator.mediaDevices?.getUserMedia) {
			setUploadError("Camera is not supported on this device/browser.");
			return;
		}
		setIsStartingCamera(true);
		setUploadError(null);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: "environment" },
				audio: false
			});
			if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((track) => track.stop());
			setIsCameraOpen(true);
			pendingCameraStreamRef.current = stream;
		} catch {
			setUploadError("Unable to access camera. Please allow camera permission or upload from files.");
			setIsCameraOpen(false);
		} finally {
			setIsStartingCamera(false);
		}
	};
	const closeCamera = () => {
		if (mediaStreamRef.current) {
			mediaStreamRef.current.getTracks().forEach((track) => track.stop());
			mediaStreamRef.current = null;
		}
		if (pendingCameraStreamRef.current) {
			pendingCameraStreamRef.current.getTracks().forEach((track) => track.stop());
			pendingCameraStreamRef.current = null;
		}
		if (cameraVideoRef.current) cameraVideoRef.current.srcObject = null;
		setIsCameraOpen(false);
	};
	const capturePhoto = async () => {
		const video = cameraVideoRef.current;
		if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
			setUploadError("Camera is not ready yet. Please try again in a moment.");
			return;
		}
		const canvas = document.createElement("canvas");
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const context = canvas.getContext("2d");
		if (!context) {
			setUploadError("Could not capture photo. Please upload from files.");
			return;
		}
		context.drawImage(video, 0, 0, canvas.width, canvas.height);
		const blob = await new Promise((resolve) => {
			canvas.toBlob((capturedBlob) => resolve(capturedBlob), "image/jpeg", .92);
		});
		if (!blob) {
			setUploadError("Could not capture photo. Please upload from files.");
			return;
		}
		handlePhotoSelect(new File([blob], `captured-pet-${Date.now()}.jpg`, { type: "image/jpeg" }));
		closeCamera();
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		setSubmitError(null);
		if (isFoundReport && !petVideo) {
			setUploadError("Please upload a video of the pet you found.");
			return;
		}
		if (!isFoundReport && !petPhoto) {
			setUploadError("Please upload a photo of your pet. It is what we match against.");
			return;
		}
		if (!isFoundReport && !user) {
			setSubmitError("Please sign in before reporting a lost pet.");
			return;
		}
		setSubmitting(true);
		try {
			let photoUrl = null;
			let videoPath = null;
			if (isFoundReport && petVideo) {
				videoPath = await uploadToBucket(VIDEO_BUCKET, petVideo);
				const frame = await extractVideoFrame(petVideo);
				if (frame) photoUrl = await uploadToBucket(PHOTO_BUCKET, frame);
			}
			if (!isFoundReport && petPhoto) photoUrl = await uploadToBucket(PHOTO_BUCKET, petPhoto);
			let data = null;
			if (isFoundReport) {
				const foundReportId = generateId();
				const { error } = await supabase.from("pet_reports").insert({
					id: foundReportId,
					type: kind,
					pet_owner_id: null,
					pet_name: null,
					pet_type: null,
					breed,
					color,
					location: lastSeenLocation,
					description,
					contact_info: contactInfo,
					status: foundStatus,
					photo_url: photoUrl,
					video_url: videoPath
				});
				if (error) throw error;
				data = {
					id: foundReportId,
					type: "found"
				};
			} else {
				const { data: inserted, error } = await supabase.from("pet_reports").insert({
					type: kind,
					pet_owner_id: user?.id ?? null,
					pet_name: petName,
					pet_type: null,
					breed: null,
					color: null,
					location: lastSeenLocation,
					description: null,
					contact_info: null,
					status: null,
					photo_url: photoUrl,
					video_url: videoPath
				}).select().single();
				if (error) throw error;
				data = inserted;
			}
			if (data) await notifyPotentialMatches(data);
			setSubmitted(true);
		} catch (error) {
			setSubmitError(error instanceof Error ? error.message : "Something went wrong submitting your report. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};
	if (submitted) return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-xl px-4 py-20 text-center",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "text-3xl text-foreground",
			children: "Thank you! 🐾"
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-3 text-muted-foreground",
			children: isFoundReport ? "Your report has been received. If it matches a missing pet, we'll email the owner right away with your contact details." : "Your report has been received. We'll email you the moment a matching found pet is reported."
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-2xl px-4 py-12 sm:px-6",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "text-4xl text-foreground",
				children: title
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-muted-foreground",
				children: subtitle
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "mt-8 space-y-5 rounded-2xl border border-border bg-card p-7 shadow-sm",
				children: [
					isFoundReport ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Field, {
						label: "Pet Video",
						children: [
							/* @__PURE__ */ jsx("input", {
								ref: videoInputRef,
								type: "file",
								accept: "video/mp4,video/webm,video/quicktime,video/x-matroska",
								className: "hidden",
								onChange: handleVideoInputChange
							}),
							/* @__PURE__ */ jsx("div", {
								onDragOver: (event) => {
									event.preventDefault();
									setIsDraggingVideo(true);
								},
								onDragLeave: () => setIsDraggingVideo(false),
								onDrop: handleVideoDrop,
								onClick: () => videoInputRef.current?.click(),
								className: `relative flex min-h-56 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-8 text-center transition-colors ${isDraggingVideo ? "border-primary bg-primary/5" : "border-border hover:border-primary/60"}`,
								role: "button",
								tabIndex: 0,
								onKeyDown: (event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										videoInputRef.current?.click();
									}
								},
								children: videoPreviewUrl ? /* @__PURE__ */ jsx("video", {
									src: videoPreviewUrl,
									controls: true,
									playsInline: true,
									className: "max-h-64 w-full rounded-md",
									onClick: (event) => event.stopPropagation()
								}) : /* @__PURE__ */ jsxs(Fragment, { children: [
									/* @__PURE__ */ jsx(UploadCloud, {
										className: "h-10 w-10 text-muted-foreground",
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-3 text-sm font-semibold text-foreground",
										children: "Click to upload or drag and drop"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: "MP4, WEBM, MOV, MKV up to 45MB"
									})
								] })
							}),
							uploadError ? /* @__PURE__ */ jsx("p", {
								className: "mt-2 text-sm text-destructive",
								children: uploadError
							}) : null,
							/* @__PURE__ */ jsx("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: "Your video stays private. It is only used to match against reported missing pets."
							})
						]
					}), /* @__PURE__ */ jsx(Field, {
						label: "Current status",
						children: /* @__PURE__ */ jsx("input", {
							className: inputCls,
							placeholder: "e.g. With me at home, at the vet, still on the street...",
							value: foundStatus,
							onChange: (event) => setFoundStatus(event.target.value)
						})
					})] }) : /* @__PURE__ */ jsxs(Field, {
						label: "Pet Photo",
						children: [
							/* @__PURE__ */ jsx("input", {
								ref: photoInputRef,
								type: "file",
								accept: "image/jpeg,image/jpg,image/png,image/webp",
								className: "hidden",
								onChange: handlePhotoInputChange
							}),
							/* @__PURE__ */ jsx("div", {
								onDragOver: (event) => {
									event.preventDefault();
									setIsDraggingPhoto(true);
								},
								onDragLeave: () => setIsDraggingPhoto(false),
								onDrop: handlePhotoDrop,
								onClick: () => photoInputRef.current?.click(),
								className: `relative flex min-h-56 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-8 text-center transition-colors ${isDraggingPhoto ? "border-primary bg-primary/5" : "border-border hover:border-primary/60"}`,
								role: "button",
								tabIndex: 0,
								onKeyDown: (event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										photoInputRef.current?.click();
									}
								},
								children: photoPreviewUrl ? /* @__PURE__ */ jsx("img", {
									src: photoPreviewUrl,
									alt: "Selected pet",
									className: "max-h-64 w-full rounded-md object-cover"
								}) : /* @__PURE__ */ jsxs(Fragment, { children: [
									/* @__PURE__ */ jsx(UploadCloud, {
										className: "h-10 w-10 text-muted-foreground",
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-3 text-sm font-semibold text-foreground",
										children: "Click to upload or drag and drop"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: "JPG, JPEG, PNG, WEBP up to 5MB"
									})
								] })
							}),
							uploadError ? /* @__PURE__ */ jsx("p", {
								className: "mt-2 text-sm text-destructive",
								children: uploadError
							}) : null,
							/* @__PURE__ */ jsxs("div", {
								className: "mt-2 flex flex-wrap items-center gap-3",
								children: [
									/* @__PURE__ */ jsx("button", {
										type: "button",
										className: "text-sm font-semibold text-primary hover:text-primary/80",
										onClick: () => photoInputRef.current?.click(),
										children: "Browse My Files"
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										className: "text-sm font-semibold text-primary hover:text-primary/80 disabled:cursor-not-allowed disabled:text-muted-foreground",
										onClick: openCamera,
										disabled: isStartingCamera || isCameraOpen,
										children: isStartingCamera ? "Opening Camera..." : "Open Camera"
									}),
									isCameraOpen ? /* @__PURE__ */ jsx("button", {
										type: "button",
										className: "text-sm font-semibold text-primary hover:text-primary/80",
										onClick: closeCamera,
										children: "Close Camera"
									}) : null
								]
							}),
							isCameraOpen ? /* @__PURE__ */ jsxs("div", {
								className: "mt-3 rounded-md border border-border p-3",
								children: [/* @__PURE__ */ jsx("video", {
									ref: cameraVideoRef,
									autoPlay: true,
									playsInline: true,
									muted: true,
									className: "w-full rounded-md"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "mt-3 h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90",
									onClick: capturePhoto,
									children: "Take Photo"
								})]
							}) : null
						]
					}),
					isFoundReport ? /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ jsx(Field, {
								label: "Breed",
								children: /* @__PURE__ */ jsx("input", {
									className: inputCls,
									placeholder: "e.g. Labrador",
									value: breed,
									onChange: (event) => setBreed(event.target.value)
								})
							}), /* @__PURE__ */ jsx(Field, {
								label: "Color",
								children: /* @__PURE__ */ jsx("input", {
									className: inputCls,
									placeholder: "e.g. White",
									value: color,
									onChange: (event) => setColor(event.target.value)
								})
							})]
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Where you found the pet",
							children: /* @__PURE__ */ jsx("input", {
								required: true,
								className: inputCls,
								placeholder: "Street, city, landmark",
								value: lastSeenLocation,
								onChange: (event) => setLastSeenLocation(event.target.value)
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Description",
							children: /* @__PURE__ */ jsx("textarea", {
								rows: 4,
								className: "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none py-2",
								placeholder: "Distinctive features, collar, behavior...",
								value: description,
								onChange: (event) => setDescription(event.target.value)
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Contact info",
							children: /* @__PURE__ */ jsx("input", {
								required: true,
								className: inputCls,
								placeholder: "Phone or email",
								value: contactInfo,
								onChange: (event) => setContactInfo(event.target.value)
							})
						}),
						/* @__PURE__ */ jsx("p", {
							className: "-mt-3 text-xs text-muted-foreground",
							children: "Shared only with the pet's owner if we find a match. Never shown publicly."
						})
					] }) : /* @__PURE__ */ jsxs("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ jsx(Field, {
							label: "Pet Name (optional)",
							children: /* @__PURE__ */ jsx("input", {
								className: inputCls,
								placeholder: "e.g. Bruno",
								value: petName,
								onChange: (event) => setPetName(event.target.value)
							})
						}), /* @__PURE__ */ jsx(Field, {
							label: "Last seen location (optional)",
							children: /* @__PURE__ */ jsx("input", {
								className: inputCls,
								placeholder: "Street, city, landmark",
								value: lastSeenLocation,
								onChange: (event) => setLastSeenLocation(event.target.value)
							})
						})]
					}),
					submitError ? /* @__PURE__ */ jsx("p", {
						className: "text-sm text-destructive",
						children: submitError
					}) : null,
					/* @__PURE__ */ jsx("button", {
						disabled: submitting,
						className: "h-11 w-full rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60",
						children: submitting ? "Submitting..." : "Submit Report"
					})
				]
			})
		]
	});
}
//#endregion
export { ReportPetForm as t };
