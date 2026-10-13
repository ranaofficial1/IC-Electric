import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import TextField from "../../components/ui/TextField.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../components/ui/Icon.jsx";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { message, devResetToken? }
  const [formError, setFormError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      const res = await forgotPassword(email);
      setResult(res);
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Enter your email and we&apos;ll send you a link to reset it.
        </p>
      </div>

      {formError && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {result ? (
        <div className="space-y-4">
          <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <Icon name="check" className="mt-0.5 shrink-0" />
            <span>{result.message}</span>
          </div>

          {result.devResetToken && (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-xs text-neutral-600">
              <p className="font-semibold text-neutral-700">Dev mode only</p>
              <p className="mt-1">
                No email service is wired up yet, so here&apos;s a direct link for local testing:
              </p>
              <Link
                to={`/reset-password?token=${result.devResetToken}`}
                className="mt-2 inline-block break-all font-semibold text-brand-600 hover:underline"
              >
                Reset your password
              </Link>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <TextField
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" variant="primary" className="w-full justify-center" disabled={submitting}>
            {submitting && <Icon name="spinner" className="animate-spin" />}
            {submitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-neutral-500">
        Remembered your password?{" "}
        <Link to="/login" className="font-semibold text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
