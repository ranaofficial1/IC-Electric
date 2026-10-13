import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { ApiRequestError } from "../../services/api.js";
import { detailsToFieldErrors } from "../../utils/formErrors.js";
import TextField from "../../components/ui/TextField.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../components/ui/Icon.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setFieldErrors({});

    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords don't match." });
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
      });
      navigate("/account/profile", { replace: true });
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 422) {
        setFieldErrors(detailsToFieldErrors(err.details));
      } else {
        setFormError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-neutral-500">Join Hale for faster checkout and order tracking.</p>
      </div>

      {formError && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          id="name"
          label="Full name"
          autoComplete="name"
          required
          value={form.name}
          onChange={update("name")}
          error={fieldErrors.name}
        />
        <TextField
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={update("email")}
          error={fieldErrors.email}
        />
        <TextField
          id="phone"
          label="Phone number (optional)"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={update("phone")}
          error={fieldErrors.phone}
        />

        <div className="relative">
          <TextField
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            value={form.password}
            onChange={update("password")}
            error={fieldErrors.password}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-[34px] text-neutral-400 hover:text-neutral-600"
          >
            <Icon name={showPassword ? "eyeSlash" : "eye"} />
          </button>
        </div>

        <TextField
          id="confirmPassword"
          label="Confirm password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          value={form.confirmPassword}
          onChange={update("confirmPassword")}
          error={fieldErrors.confirmPassword}
        />

        <p className="text-xs text-neutral-400">Must be at least 8 characters.</p>

        <Button type="submit" variant="primary" className="w-full justify-center" disabled={submitting}>
          {submitting && <Icon name="spinner" className="animate-spin" />}
          {submitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
