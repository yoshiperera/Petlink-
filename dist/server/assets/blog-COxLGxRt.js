import { t as MainLayout } from "./MainLayout-Q0ocpr4O.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, Calendar, Clock, Heart, Tag, User } from "lucide-react";
//#region src/components/blog/BlogCard.tsx
function BlogCard({ post }) {
	return /* @__PURE__ */ jsxs("article", {
		className: "flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative aspect-[16/10] overflow-hidden",
			children: [/* @__PURE__ */ jsx("img", {
				src: post.image,
				alt: post.title,
				loading: "lazy",
				className: "h-full w-full object-cover"
			}), /* @__PURE__ */ jsxs("span", {
				className: "absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-pink-brand px-2.5 py-1 text-xs font-semibold text-pink-900",
				children: [
					/* @__PURE__ */ jsx(Tag, { className: "h-3 w-3" }),
					" ",
					post.category
				]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-1 flex-col p-5",
			children: [
				/* @__PURE__ */ jsx("h3", {
					className: "text-lg font-bold leading-snug text-foreground",
					children: post.title
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 line-clamp-3 text-sm text-muted-foreground",
					children: post.excerpt
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1",
							children: [
								/* @__PURE__ */ jsx(User, { className: "h-3 w-3" }),
								" ",
								post.author
							]
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1",
							children: [
								/* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
								" ",
								post.date
							]
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1",
							children: [
								/* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
								" ",
								post.readTime
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("button", {
					className: "mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-green-brand px-4 py-2 text-sm font-semibold text-green-900 transition hover:brightness-95",
					children: ["Read More ", /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/home/CTA.tsx
function CTA() {
	const [email, setEmail] = useState("");
	return /* @__PURE__ */ jsx("section", {
		className: "bg-gradient-to-b from-accent to-accent/60 py-16",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-2xl px-4 text-center sm:px-6",
			children: [
				/* @__PURE__ */ jsx(Heart, { className: "mx-auto h-10 w-10 text-primary" }),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-3xl text-foreground",
					children: "Stay Updated with Petlink Stories"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-3 text-muted-foreground",
					children: "Get the latest success stories, tips, and updates delivered to your inbox. Join our community of pet lovers making a difference."
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: (e) => {
						e.preventDefault();
						setEmail("");
					},
					className: "mx-auto mt-6 flex max-w-md gap-2 rounded-xl border-2 border-primary/40 bg-card p-1.5",
					children: [/* @__PURE__ */ jsx("input", {
						type: "email",
						required: true,
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "Enter your email",
						className: "flex-1 bg-transparent px-3 py-2 text-sm outline-none"
					}), /* @__PURE__ */ jsx("button", {
						className: "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90",
						children: "Subscribe"
					})]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-3 text-xs text-muted-foreground",
					children: "We respect your privacy. Unsubscribe at any time."
				})
			]
		})
	});
}
//#endregion
//#region src/routes/blog.tsx?tsr-split=component
var posts = [
	{
		id: "1",
		title: "How to Create an Effective Lost Pet Poster",
		excerpt: "Learn the essential elements that make a lost pet poster effective and increase your chances of finding your beloved companion.",
		image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=900&q=80",
		category: "Tips",
		author: "Emma Rodriguez",
		date: "1/22/2025",
		readTime: "6 min read"
	},
	{
		id: "2",
		title: "Understanding Pet Microchipping: A Complete Guide",
		excerpt: "Everything you need to know about microchipping your pet, from the procedure to maintaining updated information.",
		image: "https://images.unsplash.com/photo-1583511666445-775f1f2116f5?w=900&q=80",
		category: "Health",
		author: "Dr. Michael Chen",
		date: "1/20/2025",
		readTime: "8 min read"
	},
	{
		id: "3",
		title: "Building a Pet-Safe Community: Neighborhood Tips",
		excerpt: "Discover how communities can work together to create safer environments for pets and prevent them from getting lost.",
		image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=900&q=80",
		category: "Community",
		author: "Lisa Thompson",
		date: "1/18/2025",
		readTime: "7 min read"
	}
];
function BlogPage() {
	return /* @__PURE__ */ jsxs(MainLayout, { children: [/* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-end justify-between",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-4xl text-foreground",
				children: "Latest Posts"
			}), /* @__PURE__ */ jsxs("p", {
				className: "text-sm text-muted-foreground",
				children: [
					"Showing ",
					posts.length,
					" of ",
					posts.length,
					" posts"
				]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3",
			children: posts.map((p) => /* @__PURE__ */ jsx(BlogCard, { post: p }, p.id))
		})]
	}), /* @__PURE__ */ jsx(CTA, {})] });
}
//#endregion
export { BlogPage as component };
