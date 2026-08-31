import { jsx } from "react/jsx-runtime";
//#region src/components/common/Loader.tsx
function Loader() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex items-center justify-center py-12",
		children: /* @__PURE__ */ jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" })
	});
}
//#endregion
export { Loader as t };
