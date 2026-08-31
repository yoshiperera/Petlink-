import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, Heart } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
//#region src/components/common/Logo.tsx
function Logo() {
	return /* @__PURE__ */ jsxs(Link, {
		to: "/",
		className: "flex items-center gap-2.5",
		children: [/* @__PURE__ */ jsx("span", {
			className: "grid h-10 w-10 place-items-center rounded-xl bg-yellow-brand shadow-sm",
			children: /* @__PURE__ */ jsx(Heart, { className: "h-5 w-5 fill-white text-white" })
		}), /* @__PURE__ */ jsx("span", {
			className: "text-xl font-extrabold tracking-tight text-white",
			children: "Petlink"
		})]
	});
}
//#endregion
//#region src/lib/constants.ts
var NAV_LINKS = [
	{
		to: "/",
		label: "Home"
	},
	{
		to: "/lost-pets",
		label: "Lost Pets"
	},
	{
		to: "/found-pets",
		label: "Found Pets"
	},
	{
		to: "/happy-tails",
		label: "Happy Tails"
	},
	{
		to: "/blog",
		label: "Blog"
	},
	{
		to: "/profile",
		label: "Profile"
	}
];
//#endregion
//#region src/lib/supabase.ts
var supabaseUrl = "https://edsdnwfreeehytwcjooy.supabase.co";
var supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkc2Rud2ZyZWVlaHl0d2Nqb295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3OTA1ODIsImV4cCI6MjEwMjM2NjU4Mn0.UOi2VrhWnNPbKcYjA2sd82B9gAnLRsLpYZsu5BwffcQ";
var isSupabaseConfigured = Boolean(supabaseAnonKey);
var supabase = createClient(supabaseUrl, supabaseAnonKey);
var PHOTO_BUCKET = "pet-photos";
var VIDEO_BUCKET = "pet-videos";
//#endregion
//#region src/hooks/use-auth.tsx
function useAuth() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		let active = true;
		supabase.auth.getSession().then(({ data }) => {
			if (!active) return;
			setUser(data.session?.user ?? null);
			setLoading(false);
		});
		const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
			setLoading(false);
		});
		return () => {
			active = false;
			subscription.subscription.unsubscribe();
		};
	}, []);
	const signOut = async () => {
		await supabase.auth.signOut({ scope: "local" });
	};
	return {
		user,
		loading,
		signOut
	};
}
//#endregion
//#region src/components/common/Navbar.tsx
function Navbar() {
	const { user, loading, signOut } = useAuth();
	const navigate = useNavigate();
	const handleSignOut = async () => {
		await signOut();
		navigate({ to: "/" });
	};
	return /* @__PURE__ */ jsx("header", {
		className: "sticky top-0 z-50 bg-teal text-teal-foreground shadow-sm",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ jsx(Logo, {}),
				/* @__PURE__ */ jsx("nav", {
					className: "hidden items-center gap-7 md:flex",
					children: NAV_LINKS.map((l) => /* @__PURE__ */ jsx(Link, {
						to: l.to,
						className: "text-sm font-semibold text-white/85 transition hover:text-white",
						activeProps: { className: "text-yellow-brand border-b-2 border-yellow-brand pb-1 -mb-1" },
						activeOptions: { exact: l.to === "/" },
						children: l.label
					}, l.to))
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-2",
					children: loading ? null : user ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Link, {
						to: "/profile",
						className: "rounded-md border border-white/80 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10",
						children: "My Profile"
					}), /* @__PURE__ */ jsx("button", {
						onClick: handleSignOut,
						className: "rounded-md border border-white/80 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10",
						children: "Sign Out"
					})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Link, {
						to: "/register",
						className: "rounded-md border border-white/80 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10",
						children: "Sign Up"
					}), /* @__PURE__ */ jsx(Link, {
						to: "/login",
						className: "rounded-md border border-white/80 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10",
						children: "Sign In"
					})] })
				})
			]
		})
	});
}
//#endregion
//#region src/components/common/Footer.tsx
function Footer() {
	return /* @__PURE__ */ jsxs("footer", {
		className: "bg-teal text-teal-foreground",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8",
			children: [
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Heart, { className: "h-6 w-6 text-white" }), /* @__PURE__ */ jsx("span", {
						className: "text-lg font-extrabold",
						children: "Petlink"
					})]
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-3 max-w-xs text-sm text-white/75",
					children: "Community-powered platform helping reunite lost pets with their families."
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
					className: "text-sm font-bold uppercase tracking-wider",
					children: "Quick Links"
				}), /* @__PURE__ */ jsxs("ul", {
					className: "mt-4 space-y-2 text-sm text-white/80",
					children: [
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: "/lost-pets",
							className: "hover:text-white",
							children: "Lost Pets"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: "/found-pets",
							className: "hover:text-white",
							children: "Found Pets"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: "/happy-tails",
							className: "hover:text-white",
							children: "Happy Tails"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: "/blog",
							className: "hover:text-white",
							children: "Blog"
						}) })
					]
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
					className: "text-sm font-bold uppercase tracking-wider",
					children: "Resources"
				}), /* @__PURE__ */ jsxs("ul", {
					className: "mt-4 space-y-2 text-sm text-white/80",
					children: [
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: "/report-lost",
							className: "hover:text-white",
							children: "Report Lost Pet"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: "/report-found",
							className: "hover:text-white",
							children: "Report Found Pet"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: "/login",
							className: "hover:text-white",
							children: "Sign In"
						}) })
					]
				})] })
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "border-t border-white/15 py-5 text-center text-xs text-white/70",
			children: [
				"Â© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" Petlink. Made with love for pets and their families."
			]
		})]
	});
}
//#endregion
//#region src/components/common/SetupNotice.tsx
/**
* Shown until VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set. Without them
* every sign-in, report and listing fails with an opaque network error, so say
* plainly what is missing instead.
*/
function SetupNotice() {
	if (isSupabaseConfigured) return null;
	return /* @__PURE__ */ jsx("div", {
		className: "border-b border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900",
		children: /* @__PURE__ */ jsxs("p", {
			className: "inline-flex flex-wrap items-center justify-center gap-2",
			children: [/* @__PURE__ */ jsx(AlertTriangle, {
				className: "h-4 w-4",
				"aria-hidden": "true"
			}), /* @__PURE__ */ jsxs("span", { children: [
				/* @__PURE__ */ jsx("strong", { children: "Setup needed:" }),
				" copy ",
				/* @__PURE__ */ jsx("code", { children: ".env.example" }),
				" to ",
				/* @__PURE__ */ jsx("code", { children: ".env" }),
				", add your Supabase URL and anon key, and run ",
				/* @__PURE__ */ jsx("code", { children: "supabase/schema.sql" }),
				". Accounts and pet reports won't work until then."
			] })]
		})
	});
}
//#endregion
//#region src/layouts/MainLayout.tsx
function MainLayout({ children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-screen flex-col bg-background",
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx(SetupNotice, {}),
			/* @__PURE__ */ jsx("main", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { supabase as a, VIDEO_BUCKET as i, useAuth as n, PHOTO_BUCKET as r, MainLayout as t };
