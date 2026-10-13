import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { ApiRequestError } from "../../services/api.js";
import { detailsToFieldErrors } from "../../utils/formErrors.js";
import TextField from "../../components/ui/TextField.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../components/ui/Icon.jsx";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setFieldErrors({});

    if (newPassword !== confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords don't match." });
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
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

  if (!token) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 text-center sm:px-6">
        <Icon name="circleExclamation" className="mx-auto mb-4 text-[32px] text-rose-400" />
        <h1 className="font-display text-2xl font-bold text-neutral-900">Missing reset link</h1>
        <p className="mt-2 text-sm text-neutral-500">
          This page needs a reset token — use the link from your email (or the dev link from the
          forgot-password page).
        </p>
        <Button to="/forgot-password" variant="secondary" className="mx-auto mt-6">
          Request a new link
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900">
          Set a new password
        </h1>
      </div>

      {formError && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {success ? (
        <div className="space-y-4 text-center">
          <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm text-emerald-700">
            <Icon name="check" className="mt-0.5 shrink-0" />
            <span>Password updated. You can now log in.</span>
          </div>
          <Button to="/login" variant="primary" className="w-full justify-center">
            Go to Login
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <TextField
            id="newPassword"
            label="New password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={fieldErrors.newPassword}
          />
          <TextField
            id="confirmPassword"
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={fieldErrors.confirmPassword}
          />
          <p className="text-xs text-neutral-400">Must be at least 8 characters.</p>
          <Button type="submit" variant="primary" className="w-full justify-center" disabled={submitting}>
            {submitting && <Icon name="spinner" className="animate-spin" />}
            {submitting ? "Updating..." : "Update Password"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-neutral-500">
        <Link to="/login" className="font-semibold text-brand-600 hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
