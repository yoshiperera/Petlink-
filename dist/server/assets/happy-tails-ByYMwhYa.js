import { a as supabase, t as MainLayout } from "./MainLayout-Q0ocpr4O.js";
import { n as SearchBar, t as PetCard } from "./PetCard-CEAB8Yvu.js";
import { t as Loader } from "./Loader-Dqku2GAo.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
//#region src/components/stories/StoryCard.tsx
function StoryCard({ pet }) {
	return /* @__PURE__ */ jsx(PetCard, { pet: {
		...pet,
		status: "reunited"
	} });
}
//#endregion
//#region src/routes/happy-tails.tsx?tsr-split=component
function HappyTailsPage() {
	const [q, setQ] = useState("");
	const { data, isLoading, isError } = useQuery({
		queryKey: ["happy_tails"],
		queryFn: async () => {
			const { data, error } = await supabase.from("happy_tails").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const stories = data ?? [];
	const term = q.trim().toLowerCase();
	const filtered = stories.filter((story) => !term || (story.pet_name ?? "").toLowerCase().includes(term));
	return /* @__PURE__ */ jsxs(MainLayout, { children: [/* @__PURE__ */ jsxs("section", {
		className: "relative overflow-hidden bg-cream py-16",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "absolute left-10 top-10 text-4xl opacity-40",
				children: "ðŸ¾"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute right-10 top-10 text-4xl opacity-40",
				children: "ðŸ¾"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute left-20 bottom-6 text-4xl opacity-40",
				children: "ðŸ¾"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute right-20 bottom-6 text-4xl opacity-40",
				children: "ðŸ¾"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mx-auto max-w-3xl px-4 text-center",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-5xl text-foreground",
					children: "Happy Reunion Stories"
				}), /* @__PURE__ */ jsx("p", {
					className: "mx-auto mt-4 max-w-xl text-muted-foreground",
					children: "Celebrating the joyful reunions that make our hearts full. These success stories show the power of community in bringing pets home."
				})]
			})
		]
	}), /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8",
		children: [/* @__PURE__ */ jsx("div", {
			className: "mx-auto max-w-xl",
			children: /* @__PURE__ */ jsx(SearchBar, {
				placeholder: "Search reunion stories...",
				value: q,
				onChange: setQ
			})
		}), isLoading ? /* @__PURE__ */ jsx(Loader, {}) : isError ? /* @__PURE__ */ jsx("p", {
			className: "mt-12 text-center text-destructive",
			children: "Couldn't load reunion stories right now. Please refresh and try again."
		}) : filtered.length > 0 ? /* @__PURE__ */ jsx("div", {
			className: "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
			children: filtered.map((story) => /* @__PURE__ */ jsx(StoryCard, { pet: {
				id: story.id,
				name: story.pet_name || "Reunited pet",
				type: story.pet_type || "Pet",
				breed: story.breed ?? void 0,
				color: story.color ?? void 0,
				image: story.photo_url ?? void 0,
				description: story.story ?? void 0
			} }, story.id))
		}) : /* @__PURE__ */ jsx("p", {
			className: "mt-16 text-center text-muted-foreground",
			children: stories.length === 0 ? "No reunions yet — but every pet reported here gets us closer to the first one." : "No stories match that search."
		})]
	})] });
}
//#endregion
export { HappyTailsPage as component };
