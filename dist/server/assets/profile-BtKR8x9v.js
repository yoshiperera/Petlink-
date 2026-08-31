import { a as supabase, n as useAuth, t as MainLayout } from "./MainLayout-Q0ocpr4O.js";
import { t as Loader } from "./Loader-Dqku2GAo.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, PartyPopper, PawPrint, Pencil, User } from "lucide-react";
//#region src/routes/profile.tsx?tsr-split=component
var inputCls = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
function ProfilePage() {
	const { user, loading } = useAuth();
	const queryClient = useQueryClient();
	const [editingId, setEditingId] = useState(null);
	const [draft, setDraft] = useState(null);
	const { data: reports, isLoading } = useQuery({
		queryKey: [
			"pet_reports",
			"mine",
			user?.id
		],
		enabled: Boolean(user),
		queryFn: async () => {
			const { data, error } = await supabase.from("pet_reports").select("*").eq("pet_owner_id", user.id).order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const saveEdit = useMutation({
		mutationFn: async ({ id, fields }) => {
			const { error } = await supabase.from("pet_reports").update(fields).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			setEditingId(null);
			setDraft(null);
			queryClient.invalidateQueries({ queryKey: ["pet_reports"] });
		}
	});
	const markReunited = useMutation({
		mutationFn: async (report) => {
			const { error: insertError } = await supabase.from("happy_tails").insert({
				pet_owner_id: report.pet_owner_id,
				pet_name: report.pet_name,
				pet_type: report.pet_type,
				breed: report.breed,
				color: report.color,
				photo_url: report.photo_url,
				story: `${report.pet_name || "This pet"} made it home safely. Thank you Petlink community!`,
				source_report_id: report.id
			});
			if (insertError) throw insertError;
			const { error: deleteError } = await supabase.from("pet_reports").delete().eq("id", report.id);
			if (deleteError) throw deleteError;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pet_reports"] });
			queryClient.invalidateQueries({ queryKey: ["happy_tails"] });
		}
	});
	const startEditing = (report) => {
		setEditingId(report.id);
		setDraft({
			pet_name: report.pet_name,
			breed: report.breed,
			color: report.color,
			location: report.location,
			description: report.description,
			contact_info: report.contact_info
		});
	};
	if (loading) return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsx(Loader, {}) });
	if (!user) return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-lg px-4 py-20 text-center",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary",
				children: /* @__PURE__ */ jsx(User, { className: "h-8 w-8" })
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-5 text-3xl text-foreground",
				children: "You're not signed in"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-3 text-muted-foreground",
				children: "Sign in to manage your profile and pet reports."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-7 flex justify-center gap-3",
				children: [/* @__PURE__ */ jsx(Link, {
					to: "/login",
					className: "rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90",
					children: "Sign In"
				}), /* @__PURE__ */ jsx(Link, {
					to: "/register",
					className: "rounded-md border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5",
					children: "Create Account"
				})]
			})
		]
	}) });
	const myReports = reports ?? [];
	const displayName = user.user_metadata?.full_name || "Pet owner";
	return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary",
						children: /* @__PURE__ */ jsx(User, { className: "h-8 w-8" })
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold text-foreground",
						children: displayName
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: user.email
					})] }),
					/* @__PURE__ */ jsx(Link, {
						to: "/report-lost",
						className: "ml-auto rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90",
						children: "Report a Lost Pet"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-border bg-card p-5 text-center",
					children: [
						/* @__PURE__ */ jsx(PawPrint, { className: "mx-auto h-6 w-6 text-primary" }),
						/* @__PURE__ */ jsx("div", {
							className: "mt-2 text-2xl font-extrabold",
							children: myReports.length
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-sm text-muted-foreground",
							children: "Active Reports"
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-border bg-card p-5 text-center",
					children: [
						/* @__PURE__ */ jsx(Heart, { className: "mx-auto h-6 w-6 text-primary" }),
						/* @__PURE__ */ jsx("div", {
							className: "mt-2 text-2xl font-extrabold",
							children: myReports.filter((report) => report.is_reunited).length
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-sm text-muted-foreground",
							children: "Reunited"
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-10 text-xl font-bold text-foreground",
				children: "My Reports"
			}),
			isLoading ? /* @__PURE__ */ jsx(Loader, {}) : myReports.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "mt-4 rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground",
				children: "You haven't reported a lost pet yet."
			}) : /* @__PURE__ */ jsx("div", {
				className: "mt-4 space-y-4",
				children: myReports.map((report) => /* @__PURE__ */ jsx("div", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
					children: editingId === report.id && draft ? /* @__PURE__ */ jsxs("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ jsx("input", {
										className: inputCls,
										placeholder: "Pet name",
										value: draft.pet_name ?? "",
										onChange: (event) => setDraft({
											...draft,
											pet_name: event.target.value
										})
									}),
									/* @__PURE__ */ jsx("input", {
										className: inputCls,
										placeholder: "Breed",
										value: draft.breed ?? "",
										onChange: (event) => setDraft({
											...draft,
											breed: event.target.value
										})
									}),
									/* @__PURE__ */ jsx("input", {
										className: inputCls,
										placeholder: "Colour",
										value: draft.color ?? "",
										onChange: (event) => setDraft({
											...draft,
											color: event.target.value
										})
									}),
									/* @__PURE__ */ jsx("input", {
										className: inputCls,
										placeholder: "Last seen location",
										value: draft.location ?? "",
										onChange: (event) => setDraft({
											...draft,
											location: event.target.value
										})
									})
								]
							}),
							/* @__PURE__ */ jsx("textarea", {
								rows: 3,
								className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none py-2",
								placeholder: "Description",
								value: draft.description ?? "",
								onChange: (event) => setDraft({
									...draft,
									description: event.target.value
								})
							}),
							/* @__PURE__ */ jsx("input", {
								className: inputCls,
								placeholder: "Contact info",
								value: draft.contact_info ?? "",
								onChange: (event) => setDraft({
									...draft,
									contact_info: event.target.value
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ jsx("button", {
									disabled: saveEdit.isPending,
									onClick: () => saveEdit.mutate({
										id: report.id,
										fields: draft
									}),
									className: "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60",
									children: saveEdit.isPending ? "Saving..." : "Save changes"
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => {
										setEditingId(null);
										setDraft(null);
									},
									className: "rounded-md border border-input px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent",
									children: "Cancel"
								})]
							}),
							saveEdit.isError ? /* @__PURE__ */ jsx("p", {
								className: "text-sm text-destructive",
								children: "Couldn't save. Please try again."
							}) : null
						]
					}) : /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-start gap-4",
						children: [
							report.photo_url ? /* @__PURE__ */ jsx("img", {
								src: report.photo_url,
								alt: report.pet_name ?? "Reported pet",
								className: "h-24 w-24 rounded-xl object-cover"
							}) : /* @__PURE__ */ jsx("span", {
								className: "grid h-24 w-24 place-items-center rounded-xl bg-muted text-muted-foreground",
								children: /* @__PURE__ */ jsx(PawPrint, {})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "min-w-48 flex-1",
								children: [
									/* @__PURE__ */ jsx("h3", {
										className: "text-lg font-bold text-foreground",
										children: report.pet_name || "Unnamed pet"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: [
											report.pet_type,
											report.breed,
											report.color
										].filter(Boolean).join(" â€¢ ")
									}),
									report.location ? /* @__PURE__ */ jsx("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: report.location
									}) : null,
									report.description ? /* @__PURE__ */ jsx("p", {
										className: "mt-2 text-sm text-muted-foreground",
										children: report.description
									}) : null
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col gap-2",
								children: [/* @__PURE__ */ jsxs("button", {
									onClick: () => startEditing(report),
									className: "inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent",
									children: [/* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" }), " Edit"]
								}), /* @__PURE__ */ jsxs("button", {
									disabled: markReunited.isPending,
									onClick: () => markReunited.mutate(report),
									className: "inline-flex items-center gap-1.5 rounded-md bg-green-brand px-3 py-2 text-sm font-semibold text-green-900 hover:brightness-95 disabled:opacity-60",
									children: [/* @__PURE__ */ jsx(PartyPopper, { className: "h-3.5 w-3.5" }), " Reunited"]
								})]
							})
						]
					})
				}, report.id))
			}),
			markReunited.isError ? /* @__PURE__ */ jsx("p", {
				className: "mt-4 text-sm text-destructive",
				children: "Couldn't mark that pet as reunited. Please try again."
			}) : null
		]
	}) });
}
//#endregion
export { ProfilePage as component };
