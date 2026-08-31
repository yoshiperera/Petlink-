import { n as useAuth, t as MainLayout } from "./MainLayout-Q0ocpr4O.js";
import { t as ReportPetForm } from "./ReportPetForm-DgRcz13u.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { LogIn } from "lucide-react";
//#region src/routes/report-lost.tsx?tsr-split=component
function ReportLostPage() {
	const { user, loading } = useAuth();
	if (loading) return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsx("div", {
		className: "mx-auto max-w-xl px-4 py-24 text-center text-muted-foreground",
		children: "Loading..."
	}) });
	if (!user) return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-lg px-4 py-20 text-center",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary",
				children: /* @__PURE__ */ jsx(LogIn, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-5 text-3xl text-foreground",
				children: "Sign in to report a lost pet"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-3 text-muted-foreground",
				children: "We need an account so we can email you the moment someone reports a pet that matches yours."
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
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-8 text-sm text-muted-foreground",
				children: [
					"Found a pet instead?",
					" ",
					/* @__PURE__ */ jsx(Link, {
						to: "/report-found",
						className: "font-semibold text-primary hover:underline",
						children: "Report it without an account"
					})
				]
			})
		]
	}) });
	return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsx(ReportPetForm, { kind: "lost" }) });
}
//#endregion
export { ReportLostPage as component };
