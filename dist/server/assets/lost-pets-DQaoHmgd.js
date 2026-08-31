import { a as supabase, n as useAuth, t as MainLayout } from "./MainLayout-Q0ocpr4O.js";
import { n as SearchBar, t as PetCard } from "./PetCard-CEAB8Yvu.js";
import { t as Loader } from "./Loader-Dqku2GAo.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
//#region src/routes/lost-pets.tsx?tsr-split=component
var tips = [
	"Search your neighborhood thoroughly, including hiding spots",
	"Contact local animal shelters and veterinary clinics",
	"Post on social media and community groups",
	"Put up flyers with clear photos and contact information",
	"Leave familiar items outside (clothing, bedding, toys)",
	"Search during quiet times (early morning, late evening)",
	"Ask neighbors to check their garages, sheds, and basements",
	"Don't give up — pets can be found weeks or months later"
];
function LostPetsPage() {
	const { user } = useAuth();
	const [search, setSearch] = useState("");
	const { data, isLoading, isError } = useQuery({
		queryKey: ["pet_reports", "lost"],
		queryFn: async () => {
			const { data, error } = await supabase.from("pet_reports").select("*").eq("type", "lost").eq("is_reunited", false).order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const reports = data ?? [];
	const term = search.trim().toLowerCase();
	const filtered = reports.filter((report) => !term || [report.pet_name, report.location].some((field) => field?.toLowerCase().includes(term)));
	return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "text-4xl text-foreground",
				children: "Lost Pets"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-2 text-muted-foreground",
				children: [
					"Help these pets find their way home. ",
					reports.length,
					" ",
					reports.length === 1 ? "pet is" : "pets are",
					" currently missing."
				]
			}),
			!user ? /* @__PURE__ */ jsxs("div", {
				className: "mt-8 rounded-2xl border-2 border-dashed border-primary/40 bg-gradient-to-br from-blue-brand/30 to-pink-brand/30 p-10 text-center",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-2xl text-foreground",
						children: "Help Bring Them Home"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mx-auto mt-3 max-w-md text-muted-foreground",
						children: "Join our community to report lost pets and get alerts when pets are found in your area."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5 flex justify-center gap-3",
						children: [/* @__PURE__ */ jsx(Link, {
							to: "/login",
							className: "rounded-md bg-gradient-to-r from-teal to-primary px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95",
							children: "Sign In"
						}), /* @__PURE__ */ jsx(Link, {
							to: "/register",
							className: "rounded-md border border-primary px-5 py-2 text-sm font-semibold text-primary hover:bg-primary/5",
							children: "Create Account"
						})]
					})
				]
			}) : null,
			/* @__PURE__ */ jsx("div", {
				className: "mt-8",
				children: /* @__PURE__ */ jsx(SearchBar, {
					placeholder: "Search by pet name or location...",
					value: search,
					onChange: setSearch
				})
			}),
			isLoading ? /* @__PURE__ */ jsx(Loader, {}) : isError ? /* @__PURE__ */ jsx("p", {
				className: "mt-12 text-center text-destructive",
				children: "Couldn't load lost pets right now. Please refresh and try again."
			}) : filtered.length > 0 ? /* @__PURE__ */ jsx("div", {
				className: "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
				children: filtered.map((report) => /* @__PURE__ */ jsx(PetCard, { pet: {
					id: report.id,
					name: report.pet_name || "Unnamed pet",
					type: report.pet_type || "Pet",
					breed: report.breed ?? void 0,
					color: report.color ?? void 0,
					location: report.location ?? void 0,
					image: report.photo_url ?? void 0,
					description: report.description ?? void 0,
					status: "lost"
				} }, report.id))
			}) : /* @__PURE__ */ jsxs("div", {
				className: "mt-12 grid place-items-center py-12 text-center",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "grid h-20 w-20 place-items-center rounded-full bg-muted",
						children: /* @__PURE__ */ jsx(Search, { className: "h-8 w-8 text-muted-foreground" })
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "mt-5 text-xl font-bold text-foreground",
						children: reports.length === 0 ? "No Lost Pets Reported" : "No Matching Pets"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-muted-foreground",
						children: reports.length === 0 ? "There are currently no lost pets." : "Try a different search or pet type."
					}),
					/* @__PURE__ */ jsxs(Link, {
						to: "/report-lost",
						className: "mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90",
						children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Report Lost Pet"]
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mt-10 rounded-2xl bg-blue-brand/30 p-6 sm:p-8",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-lg font-bold text-foreground",
					children: "Tips for Finding Your Lost Pet"
				}), /* @__PURE__ */ jsx("ul", {
					className: "mt-4 grid gap-2 sm:grid-cols-2",
					children: tips.map((t) => /* @__PURE__ */ jsxs("li", {
						className: "flex gap-2 text-sm text-foreground/80",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-primary",
							children: "â€¢"
						}), /* @__PURE__ */ jsx("span", { children: t })]
					}, t))
				})]
			})
		]
	}) });
}
//#endregion
export { LostPetsPage as component };
