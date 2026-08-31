import { jsx, jsxs } from "react/jsx-runtime";
import { MapPin, PawPrint, Search } from "lucide-react";
//#region src/components/common/SearchBar.tsx
function SearchBar({ placeholder = "Search...", value, onChange }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "relative w-full",
		children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx("input", {
			type: "text",
			value,
			onChange: (e) => onChange?.(e.target.value),
			placeholder,
			className: "h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
		})]
	});
}
//#endregion
//#region src/components/pets/PetCard.tsx
function PetCard({ pet }) {
	const badge = pet.status === "reunited" ? "bg-green-100 text-green-700" : pet.status === "found" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700";
	return /* @__PURE__ */ jsxs("article", {
		className: "overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative aspect-[4/3] overflow-hidden bg-muted",
			children: [pet.image ? /* @__PURE__ */ jsx("img", {
				src: pet.image,
				alt: pet.name,
				loading: "lazy",
				className: "h-full w-full object-cover"
			}) : pet.video ? /* @__PURE__ */ jsx("video", {
				src: pet.video,
				controls: true,
				playsInline: true,
				muted: true,
				preload: "metadata",
				className: "h-full w-full object-cover"
			}) : /* @__PURE__ */ jsx("div", {
				className: "grid h-full w-full place-items-center text-muted-foreground",
				children: /* @__PURE__ */ jsx(PawPrint, {})
			}), pet.status && /* @__PURE__ */ jsx("span", {
				className: `absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold capitalize ${badge}`,
				children: pet.status
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "p-4",
			children: [
				/* @__PURE__ */ jsx("h3", {
					className: "text-lg font-bold text-foreground",
					children: pet.name
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "mt-1 flex items-center gap-1.5 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ jsx(PawPrint, { className: "h-3.5 w-3.5" }),
						/* @__PURE__ */ jsx("span", { children: pet.type }),
						pet.breed && /* @__PURE__ */ jsxs("span", { children: ["• ", pet.breed] }),
						pet.color && /* @__PURE__ */ jsxs("span", { children: ["• ", pet.color] })
					]
				}),
				pet.location && /* @__PURE__ */ jsxs("p", {
					className: "mt-2 flex items-center gap-1.5 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5" }),
						" ",
						pet.location
					]
				}),
				pet.description && /* @__PURE__ */ jsx("p", {
					className: "mt-2 line-clamp-2 text-sm text-muted-foreground",
					children: pet.description
				})
			]
		})]
	});
}
//#endregion
export { SearchBar as n, PetCard as t };
