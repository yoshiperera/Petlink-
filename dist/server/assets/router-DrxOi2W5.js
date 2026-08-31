import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//#region src/styles.css?url
var styles_default = "/assets/styles-BVd_2ZIC.css";
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$10 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Petlink — Help Pets Find Their Home" },
			{
				name: "description",
				content: "Community-driven platform to reunite lost pets with their families."
			},
			{
				property: "og:title",
				content: "Petlink — Help Pets Find Their Home"
			},
			{
				property: "og:description",
				content: "Community-driven platform to reunite lost pets with their families."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [/* @__PURE__ */ jsx("meta", { charSet: "UTF-8" }), /* @__PURE__ */ jsx(HeadContent, {})] }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$10.useRouteContext();
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ jsx(Outlet, {})
	});
}
//#endregion
//#region src/routes/report-lost.tsx
var $$splitComponentImporter$9 = () => import("./report-lost-DMmOHmBm.js");
var Route$9 = createFileRoute("/report-lost")({
	head: () => ({ meta: [{ title: "Report a Lost Pet — Petlink" }, {
		name: "description",
		content: "Report your lost pet and reach our community fast."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
//#endregion
//#region src/routes/report-found.tsx
var $$splitComponentImporter$8 = () => import("./report-found-DxAWrO6-.js");
var Route$8 = createFileRoute("/report-found")({
	head: () => ({ meta: [{ title: "Report a Found Pet — Petlink" }, {
		name: "description",
		content: "Report a pet you've found and help reunite them with their family."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
//#endregion
//#region src/routes/register.tsx
var $$splitComponentImporter$7 = () => import("./register-DlB80p-s.js");
var Route$7 = createFileRoute("/register")({
	head: () => ({ meta: [{ title: "Create Account — Petlink" }, {
		name: "description",
		content: "Join Petlink and help reunite lost pets with their families."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
//#endregion
//#region src/routes/profile.tsx
var $$splitComponentImporter$6 = () => import("./profile-BtKR8x9v.js");
var Route$6 = createFileRoute("/profile")({
	head: () => ({ meta: [{ title: "Profile — Petlink" }, {
		name: "description",
		content: "Your Petlink profile and pet reports."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/lost-pets.tsx
var $$splitComponentImporter$5 = () => import("./lost-pets-DQaoHmgd.js");
var Route$5 = createFileRoute("/lost-pets")({
	head: () => ({ meta: [{ title: "Lost Pets — Petlink" }, {
		name: "description",
		content: "Browse recently reported lost pets and help bring them home."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/login.tsx
var $$splitComponentImporter$4 = () => import("./login-goDBPFkG.js");
var Route$4 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Sign In — Petlink" }, {
		name: "description",
		content: "Sign in to your Petlink account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/happy-tails.tsx
var $$splitComponentImporter$3 = () => import("./happy-tails-ByYMwhYa.js");
var Route$3 = createFileRoute("/happy-tails")({
	head: () => ({ meta: [{ title: "Happy Tails — Reunion Stories | Petlink" }, {
		name: "description",
		content: "Heartwarming reunion stories from pets reunited with their families."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/found-pets.tsx
var $$splitComponentImporter$2 = () => import("./found-pets-D0cvbkb3.js");
var Route$2 = createFileRoute("/found-pets")({
	head: () => ({ meta: [{ title: "Found a Pet — Petlink" }, {
		name: "description",
		content: "Found a pet? Upload a short video and we'll match it against reported missing pets."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/blog.tsx
var $$splitComponentImporter$1 = () => import("./blog-COxLGxRt.js");
var Route$1 = createFileRoute("/blog")({
	head: () => ({ meta: [{ title: "Blog — Pet Care, Tips & Stories | Petlink" }, {
		name: "description",
		content: "Articles, guides, and tips for pet owners and community members."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter = () => import("./routes-Dof0XCiI.js");
var Route = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Petlink — Help Pets Find Their Home" }, {
		name: "description",
		content: "Report lost or found pets and join a caring community helping reunite families."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var ReportLostRoute = Route$9.update({
	id: "/report-lost",
	path: "/report-lost",
	getParentRoute: () => Route$10
});
var ReportFoundRoute = Route$8.update({
	id: "/report-found",
	path: "/report-found",
	getParentRoute: () => Route$10
});
var RegisterRoute = Route$7.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$10
});
var ProfileRoute = Route$6.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$10
});
var LostPetsRoute = Route$5.update({
	id: "/lost-pets",
	path: "/lost-pets",
	getParentRoute: () => Route$10
});
var LoginRoute = Route$4.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$10
});
var HappyTailsRoute = Route$3.update({
	id: "/happy-tails",
	path: "/happy-tails",
	getParentRoute: () => Route$10
});
var FoundPetsRoute = Route$2.update({
	id: "/found-pets",
	path: "/found-pets",
	getParentRoute: () => Route$10
});
var BlogRoute = Route$1.update({
	id: "/blog",
	path: "/blog",
	getParentRoute: () => Route$10
});
var rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$10
	}),
	BlogRoute,
	FoundPetsRoute,
	HappyTailsRoute,
	LoginRoute,
	LostPetsRoute,
	ProfileRoute,
	RegisterRoute,
	ReportFoundRoute,
	ReportLostRoute
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
