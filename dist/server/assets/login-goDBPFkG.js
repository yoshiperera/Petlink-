import { a as supabase, t as MainLayout } from "./MainLayout-Q0ocpr4O.js";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Eye, EyeOff, Heart, Lock, Mail } from "lucide-react";
//#region src/routes/login.tsx?tsr-split=component
function LoginPage() {
	const navigate = useNavigate();
	const [show, setShow] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [resetError, setResetError] = useState(null);
	const [resetMessage, setResetMessage] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const [resetSubmitting, setResetSubmitting] = useState(false);
	const handleSubmit = async (event) => {
		event.preventDefault();
		setError(null);
		setSubmitting(true);
		const { error: signInError } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (signInError) {
			setError(signInError.message);
			setSubmitting(false);
			return;
		}
		navigate({ to: "/" });
	};
	const handleForgotPassword = async (event) => {
		event.preventDefault();
		event.stopPropagation();
		setPassword("");
		setError(null);
		if (!email.trim()) {
			setResetError("Please enter your email address first.");
			setResetMessage(null);
			return;
		}
		setResetSubmitting(true);
		setResetError(null);
		setResetMessage(null);
		const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/login` });
		if (error) {
			setResetError(error.message);
			setResetSubmitting(false);
			return;
		}
		setResetMessage("Password reset link sent. Check your email and follow the instructions.");
		setResetSubmitting(false);
	};
	return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "bg-gradient-to-b from-accent/40 to-background py-14",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-md px-4 text-center",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary",
					children: /* @__PURE__ */ jsx(Heart, { className: "h-6 w-6 fill-white text-white" })
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-4 text-4xl text-foreground",
					children: "Welcome Back to Petlink"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-muted-foreground",
					children: "Sign in to help reunite pets with their families"
				})
			]
		}), /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "mx-auto mt-8 max-w-md rounded-2xl border border-border bg-card p-7 shadow-sm",
			children: [
				/* @__PURE__ */ jsx("h2", {
					className: "text-center text-lg font-bold text-foreground",
					children: "Sign In to Your Account"
				}),
				/* @__PURE__ */ jsx("label", {
					className: "mt-6 block text-sm font-semibold text-foreground",
					children: "Email Address"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "relative mt-1.5",
					children: [/* @__PURE__ */ jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx("input", {
						type: "email",
						required: true,
						autoComplete: "username",
						value: email,
						onChange: (event) => setEmail(event.target.value),
						placeholder: "Enter your email",
						className: "h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
					})]
				}),
				/* @__PURE__ */ jsx("label", {
					className: "mt-4 block text-sm font-semibold text-foreground",
					children: "Password"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "relative mt-1.5",
					children: [
						/* @__PURE__ */ jsx(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
						/* @__PURE__ */ jsx("input", {
							type: show ? "text" : "password",
							required: true,
							autoComplete: "current-password",
							value: password,
							onChange: (event) => setPassword(event.target.value),
							placeholder: "Enter your password",
							className: "h-11 w-full rounded-md border border-input bg-background pl-10 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setShow(!show),
							className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground",
							children: show ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-3 flex justify-end",
					children: /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: handleForgotPassword,
						disabled: resetSubmitting,
						className: "text-xs font-medium text-primary hover:underline disabled:opacity-60",
						children: resetSubmitting ? "Sending..." : "Forgot Password?"
					})
				}),
				error ? /* @__PURE__ */ jsx("p", {
					className: "mt-4 text-sm text-destructive",
					children: error
				}) : null,
				resetError ? /* @__PURE__ */ jsx("p", {
					className: "mt-3 text-sm text-destructive",
					children: resetError
				}) : null,
				resetMessage ? /* @__PURE__ */ jsx("p", {
					className: "mt-3 text-sm text-emerald-600",
					children: resetMessage
				}) : null,
				/* @__PURE__ */ jsx("button", {
					disabled: submitting,
					className: "mt-5 h-11 w-full rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60",
					children: submitting ? "Signing in..." : "Sign In"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "my-5 flex items-center gap-3 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-border" }),
						/* @__PURE__ */ jsx("span", { children: "Don't have an account?" }),
						/* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-border" })
					]
				}),
				/* @__PURE__ */ jsx(Link, {
					to: "/register",
					className: "block rounded-md border border-input py-2.5 text-center text-sm font-semibold text-foreground hover:bg-accent",
					children: "Create Account"
				})
			]
		})]
	}) });
}
//#endregion
export { LoginPage as component };
