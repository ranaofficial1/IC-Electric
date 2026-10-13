import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ApiRequestError } from "../../services/api.js";
import { detailsToFieldErrors } from "../../utils/formErrors.js";
import TextField from "../../components/ui/TextField.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../components/ui/Icon.jsx";

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-neutral-200/70 bg-white p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function InlineMessage({ tone = "success", children }) {
  const styles =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-rose-200 bg-rose-50 text-rose-700";
  return (
    <div className={`mb-4 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${styles}`}>
      <Icon name={tone === "success" ? "check" : "circleExclamation"} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [passwordFieldErrors, setPasswordFieldErrors] = useState({});

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setProfileSubmitting(true);
    setProfileMessage(null);
    setProfileError("");
    try {
      await updateProfile({ name, phone });
      setProfileMessage("Profile updated.");
    } catch (err) {
      setProfileError(err.message || "Couldn't update your profile. Please try again.");
    } finally {
      setProfileSubmitting(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setPasswordMessage(null);
    setPasswordError("");
    setPasswordFieldErrors({});

    if (newPassword !== confirmPassword) {
      setPasswordFieldErrors({ confirmPassword: "Passwords don't match." });
      return;
    }

    setPasswordSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordMessage("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 422) {
        setPasswordFieldErrors(detailsToFieldErrors(err.details));
      } else {
        setPasswordError(err.message || "Couldn't update your password. Please try again.");
      }
    } finally {
      setPasswordSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Profile details">
        {profileMessage && <InlineMessage tone="success">{profileMessage}</InlineMessage>}
        {profileError && <InlineMessage tone="error">{profileError}</InlineMessage>}

        <form onSubmit={handleProfileSubmit} className="space-y-4" noValidate>
          <TextField
            id="profile-name"
            label="Full name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField id="profile-email" label="Email address" value={user?.email || ""} disabled />
          <TextField
            id="profile-phone"
            label="Phone number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button type="submit" variant="primary" disabled={profileSubmitting}>
            {profileSubmitting && <Icon name="spinner" className="animate-spin" />}
            {profileSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>

      <Card title="Change password">
        {passwordMessage && <InlineMessage tone="success">{passwordMessage}</InlineMessage>}
        {passwordError && <InlineMessage tone="error">{passwordError}</InlineMessage>}

        <form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
          <TextField
            id="current-password"
            label="Current password"
            type="password"
            autoComplete="current-password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={passwordFieldErrors.currentPassword}
          />
          <TextField
            id="new-password"
            label="New password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={passwordFieldErrors.newPassword}
          />
          <TextField
            id="confirm-new-password"
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={passwordFieldErrors.confirmPassword}
          />
          <Button type="submit" variant="secondary" disabled={passwordSubmitting}>
            {passwordSubmitting && <Icon name="spinner" className="animate-spin" />}
            {passwordSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
