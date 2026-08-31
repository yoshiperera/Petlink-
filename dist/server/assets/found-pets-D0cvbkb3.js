import { t as MainLayout } from "./MainLayout-Q0ocpr4O.js";
import { t as ReportPetForm } from "./ReportPetForm-DgRcz13u.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { MailCheck, ShieldCheck, Video } from "lucide-react";
//#region src/routes/found-pets.tsx?tsr-split=component
var steps = [
	{
		icon: Video,
		title: "Upload a short video",
		desc: "A few seconds is enough. Our matcher compares it against every reported missing pet."
	},
	{
		icon: ShieldCheck,
		title: "It stays private",
		desc: "Your video and contact details are never shown publicly or listed on the site."
	},
	{
		icon: MailCheck,
		title: "We email the owner",
		desc: "If it matches a missing pet, the owner gets your details and contacts you directly."
	}
];
function FoundPetsPage() {
	return /* @__PURE__ */ jsxs(MainLayout, { children: [/* @__PURE__ */ jsxs("section", {
		className: "bg-gradient-to-b from-accent/40 to-background py-12",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-3xl px-4 text-center sm:px-6",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-4xl text-foreground",
				children: "Found a Pet?"
			}), /* @__PURE__ */ jsx("p", {
				className: "mx-auto mt-3 max-w-xl text-muted-foreground",
				children: "You don't need an account. Upload a video of the pet you found and we'll take it from there."
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "mx-auto mt-10 grid max-w-5xl gap-5 px-4 sm:px-6 md:grid-cols-3",
			children: steps.map((step) => /* @__PURE__ */ jsxs("div", {
				className: "rounded-2xl border border-border bg-card p-6 text-center shadow-sm",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10",
						children: /* @__PURE__ */ jsx(step.icon, { className: "h-5 w-5 text-primary" })
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "mt-4 text-base font-bold text-foreground",
						children: step.title
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm leading-relaxed text-muted-foreground",
						children: step.desc
					})
				]
			}, step.title))
		})]
	}), /* @__PURE__ */ jsx(ReportPetForm, { kind: "found" })] });
}
//#endregion
export { FoundPetsPage as component };
