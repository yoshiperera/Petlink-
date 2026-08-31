import { a as supabase, t as MainLayout } from "./MainLayout-Q0ocpr4O.js";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Heart } from "lucide-react";
//#region src/routes/register.tsx?tsr-split=component
var inputCls = "mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
function RegisterPage() {
	const navigate = useNavigate();
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const [needsConfirmation, setNeedsConfirmation] = useState(false);
	const handleSubmit = async (event) => {
		event.preventDefault();
		setError(null);
		if (password.length < 6) {
			setError("Password must be at least 6 characters long.");
			return;
		}
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}
		setSubmitting(true);
		const { data, error: signUpError } = await supabase.auth.signUp({
			email,
			password,
			options: { data: { full_name: fullName } }
		});
		if (signUpError) {
			setError(signUpError.message);
			setSubmitting(false);
			return;
		}
		if (data.user && data.user.identities?.length === 0) {
			setError("This email already has an account. Please sign in instead.");
			setSubmitting(false);
			return;
		}
		if (data.session && data.user) await supabase.from("profiles").upsert({
			id: data.user.id,
			full_name: fullName,
			email
		});
		setSubmitting(false);
		if (data.session) navigate({ to: "/" });
		else setNeedsConfirmation(true);
	};
	if (needsConfirmation) return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-md px-4 py-20 text-center",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "text-3xl text-foreground",
				children: "Check your email ðŸ“©"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-3 text-muted-foreground",
				children: [
					"We sent a confirmation link to ",
					/* @__PURE__ */ jsx("span", {
						className: "font-semibold",
						children: email
					}),
					". Confirm your address, then sign in to report a lost pet."
				]
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/login",
				className: "mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90",
				children: "Go to Sign In"
			})
		]
	}) });
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
					children: "Join Petlink"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-muted-foreground",
					children: "Create your account to start helping pets"
				})
			]
		}), /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "mx-auto mt-8 max-w-md rounded-2xl border border-border bg-card p-7 shadow-sm",
			children: [
				/* @__PURE__ */ jsx("label", {
					className: "block text-sm font-semibold",
					children: "Full Name"
				}),
				/* @__PURE__ */ jsx("input", {
					required: true,
					className: inputCls,
					placeholder: "Jane Doe",
					value: fullName,
					onChange: (event) => setFullName(event.target.value)
				}),
				/* @__PURE__ */ jsx("label", {
					className: "mt-4 block text-sm font-semibold",
					children: "Email"
				}),
				/* @__PURE__ */ jsx("input", {
					type: "email",
					required: true,
					className: inputCls,
					placeholder: "you@example.com",
					value: email,
					onChange: (event) => setEmail(event.target.value)
				}),
				/* @__PURE__ */ jsx("label", {
					className: "mt-4 block text-sm font-semibold",
					children: "Password"
				}),
				/* @__PURE__ */ jsx("input", {
					type: "password",
					required: true,
					minLength: 6,
					className: inputCls,
					placeholder: "Create a password",
					value: password,
					onChange: (event) => setPassword(event.target.value)
				}),
				/* @__PURE__ */ jsx("label", {
					className: "mt-4 block text-sm font-semibold",
					children: "Confirm Password"
				}),
				/* @__PURE__ */ jsx("input", {
					type: "password",
					required: true,
					className: inputCls,
					placeholder: "Confirm your password",
					value: confirmPassword,
					onChange: (event) => setConfirmPassword(event.target.value)
				}),
				error ? /* @__PURE__ */ jsx("p", {
					className: "mt-4 text-sm text-destructive",
					children: error
				}) : null,
				/* @__PURE__ */ jsx("button", {
					disabled: submitting,
					className: "mt-6 h-11 w-full rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60",
					children: submitting ? "Creating account..." : "Create Account"
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "mt-5 text-center text-sm text-muted-foreground",
					children: [
						"Already have an account?",
						" ",
						/* @__PURE__ */ jsx(Link, {
							to: "/login",
							className: "font-semibold text-primary hover:underline",
							children: "Sign in"
						})
					]
				})
			]
		})]
	}) });
}
//#endregion
export { RegisterPage as component };
