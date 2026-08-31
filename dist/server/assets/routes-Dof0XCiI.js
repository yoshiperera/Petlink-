import { t as MainLayout } from "./MainLayout-Q0ocpr4O.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Bell, Eye, Heart, MapPin, PawPrint, Search, ShieldCheck, Users } from "lucide-react";
//#region src/assets/new-photo.png
var new_photo_default = "/assets/new-photo-BFrRe46S.png";
//#endregion
//#region src/components/home/Hero.tsx
function Hero() {
	return /* @__PURE__ */ jsxs("section", {
		className: "relative overflow-hidden bg-cream",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "pointer-events-none absolute inset-0",
			children: [
				/* @__PURE__ */ jsx("div", { className: "absolute -left-16 top-16 h-56 w-56 rounded-full bg-orange-300/50 blur-3xl animate-blob-pulse" }),
				/* @__PURE__ */ jsx("div", { className: "absolute -top-16 left-1/4 h-52 w-52 rounded-full bg-pink-300/50 blur-3xl animate-blob-pulse [animation-delay:1.5s]" }),
				/* @__PURE__ */ jsx("div", { className: "absolute -right-20 top-10 h-64 w-64 rounded-full bg-teal/30 blur-3xl animate-blob-pulse [animation-delay:3s]" }),
				/* @__PURE__ */ jsx("span", {
					className: "absolute bottom-10 left-8 grid h-12 w-12 -rotate-12 place-items-center rounded-full bg-primary/10 animate-float-paw [animation-delay:0s]",
					children: /* @__PURE__ */ jsx(PawPrint, {
						className: "h-6 w-6 text-primary",
						strokeWidth: 2
					})
				}),
				/* @__PURE__ */ jsx("span", {
					className: "absolute right-16 top-28 grid h-14 w-14 rotate-12 place-items-center rounded-full bg-pink-500/10 animate-float-paw [animation-delay:0.8s]",
					children: /* @__PURE__ */ jsx(PawPrint, {
						className: "h-7 w-7 text-pink-500",
						strokeWidth: 2
					})
				}),
				/* @__PURE__ */ jsx("span", {
					className: "absolute right-8 bottom-16 grid h-12 w-12 -rotate-6 place-items-center rounded-full bg-teal/10 animate-float-paw [animation-delay:1.6s]",
					children: /* @__PURE__ */ jsx(PawPrint, {
						className: "h-6 w-6 text-teal",
						strokeWidth: 2
					})
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-24",
			children: [/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsxs("h1", {
					className: "text-5xl leading-[1.05] text-foreground md:text-6xl lg:text-7xl",
					children: [
						"Help Pets Find",
						/* @__PURE__ */ jsx("br", {}),
						"Their Home"
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-6 max-w-md text-base text-muted-foreground",
					children: "Join our community-driven platform to help reunite lost pets with their families. Every pet deserves to find their way home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-8 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/report-lost",
						className: "rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90",
						children: "Report Lost Pet"
					}), /* @__PURE__ */ jsx(Link, {
						to: "/report-found",
						className: "rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90",
						children: "Report Found Pet"
					})]
				})
			] }), /* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-x-8 top-10 h-[80%] rounded-[50%] bg-white/60 blur-2xl" }), /* @__PURE__ */ jsx("img", {
					src: new_photo_default,
					alt: "Happy pets together",
					width: 1536,
					height: 1024,
					className: "relative z-10 mx-auto w-full max-w-lg drop-shadow-xl"
				})]
			})]
		})]
	});
}
//#endregion
//#region src/components/home/Stats.tsx
var stats = [
	{
		icon: Heart,
		value: "1",
		label: "Pets Reunited",
		color: "text-green-600",
		bg: "bg-green-100"
	},
	{
		icon: Search,
		value: "0",
		label: "Lost Pets",
		color: "text-red-500",
		bg: "bg-red-100"
	},
	{
		icon: Eye,
		value: "0",
		label: "Found Pets",
		color: "text-blue-600",
		bg: "bg-blue-100"
	},
	{
		icon: Users,
		value: "5,000+",
		label: "Community Members",
		color: "text-purple-600",
		bg: "bg-purple-100"
	}
];
function Stats() {
	return /* @__PURE__ */ jsx("section", {
		className: "bg-background py-12",
		children: /* @__PURE__ */ jsx("div", {
			className: "mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:px-6 lg:grid-cols-4 lg:px-8",
			children: stats.map((s) => /* @__PURE__ */ jsxs("div", {
				className: "group rounded-xl border border-border bg-card p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: `mx-auto flex h-14 w-14 items-center justify-center rounded-full ${s.bg} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`,
						children: /* @__PURE__ */ jsx(s.icon, {
							className: `h-7 w-7 ${s.color}`,
							strokeWidth: 2.2
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-3 text-3xl font-extrabold text-foreground",
						children: s.value
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-1 text-sm text-muted-foreground",
						children: s.label
					})
				]
			}, s.label))
		})
	});
}
//#endregion
//#region src/components/home/About.tsx
function About() {
	return /* @__PURE__ */ jsx("section", {
		className: "bg-blue-brand/40 py-16",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
				className: "text-4xl text-foreground",
				children: "About Us"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-5 text-base leading-relaxed text-muted-foreground",
				children: "Petlink is a community-powered platform designed to help reunite lost pets with their families. With easy reporting tools, real-time updates, and a caring network, we make it simple to connect pet owners with those who've found their furry friends because every pawprint matters."
			})] }), /* @__PURE__ */ jsx("div", {
				className: "overflow-hidden rounded-2xl shadow-lg",
				children: /* @__PURE__ */ jsx("img", {
					src: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=1200&q=80",
					alt: "Family with their dog",
					loading: "lazy",
					className: "aspect-[4/3] w-full object-cover"
				})
			})]
		})
	});
}
//#endregion
//#region src/components/home/HowItWorks.tsx
var items = [
	{
		icon: MapPin,
		title: "Interactive Map",
		desc: "View lost and found pets on an interactive map with precise location tracking and real-time updates.",
		bg: "bg-blue-brand/50",
		iconBg: "bg-blue-200",
		iconColor: "text-blue-600"
	},
	{
		icon: Bell,
		title: "Real-time Notifications",
		desc: "Get instant alerts when pets matching your search criteria are reported in your area.",
		bg: "bg-pink-brand/50",
		iconBg: "bg-pink-200",
		iconColor: "text-pink-500"
	},
	{
		icon: ShieldCheck,
		title: "Secure & Moderated",
		desc: "All listings are verified and moderated to ensure authenticity and prevent misuse.",
		bg: "bg-green-brand/60",
		iconBg: "bg-green-200",
		iconColor: "text-green-600"
	}
];
function HowItWorks() {
	return /* @__PURE__ */ jsx("section", {
		className: "bg-background py-16",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "text-center",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-4xl text-foreground",
					children: "How Petlink Works"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-3 text-muted-foreground",
					children: "Simple steps to help reunite pets with their families"
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-10 grid gap-6 md:grid-cols-3",
				children: items.map((it) => /* @__PURE__ */ jsxs("div", {
					className: `rounded-2xl ${it.bg} p-8 text-center`,
					children: [
						/* @__PURE__ */ jsx("span", {
							className: `mx-auto grid h-14 w-14 place-items-center rounded-full ${it.iconBg}`,
							children: /* @__PURE__ */ jsx(it.icon, { className: `h-6 w-6 ${it.iconColor}` })
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "mt-4 text-xl font-bold text-foreground",
							children: it.title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3 text-sm leading-relaxed text-muted-foreground",
							children: it.desc
						})
					]
				}, it.title))
			})]
		})
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
function HomePage() {
	return /* @__PURE__ */ jsxs(MainLayout, { children: [
		/* @__PURE__ */ jsx(Hero, {}),
		/* @__PURE__ */ jsx(Stats, {}),
		/* @__PURE__ */ jsx(About, {}),
		/* @__PURE__ */ jsx(HowItWorks, {})
	] });
}
//#endregion
export { HomePage as component };
