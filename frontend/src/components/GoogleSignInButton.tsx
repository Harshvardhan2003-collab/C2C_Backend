import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { dashboardPathForRole } from "@/lib/utils";

// Minimal Google ID token shape
type GoogleJwt = {
  email: string;
  name?: string;
  picture?: string;
};

type Props = { className?: string; redirectTo?: "profile" | "dashboard" };

export default function GoogleSignInButton({ className, redirectTo = "dashboard" }: Props) {
  const { loginWithGoogleToken } = useAuth();
  const navigate = useNavigate();

  const onSuccess = (cred: CredentialResponse) => {
    (async () => {
      if (!cred.credential) return;
      // Exchange Google ID token with backend to establish session
      const { user } = await loginWithGoogleToken(cred.credential);
      const role = user?.role || "student";
      if (redirectTo === "profile") {
        navigate("/profile");
      } else {
        navigate(dashboardPathForRole(role));
      }
    })();
  };

  const onError = () => {
    // No-op; you may add toast if desired
  };

  return (
    <div className={className}>
      <GoogleLogin onSuccess={onSuccess} onError={onError} ux_mode="popup" useOneTap={false} />
    </div>
  );
}
