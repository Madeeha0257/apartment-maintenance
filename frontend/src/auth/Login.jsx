import { useState } from "react";
import {
  signIn,
  confirmSignIn,
} from "aws-amplify/auth";

function Login({ onSwitchToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [requiresNewPassword, setRequiresNewPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const result = await signIn({
        username: email.trim(),
        password,
      });

      if (result.isSignedIn) {
        await onLoginSuccess();
        return;
      }

      if (
        result.nextStep?.signInStep ===
        "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        setRequiresNewPassword(true);
        setMessage(
          "Your temporary password is valid. Please create a new password."
        );
        return;
      }

      setMessage(
        "Additional sign-in verification is required. Please try again."
      );
    } catch (error) {
      console.error("Login failed:", error);
      setMessage(error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewPassword = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!newPassword) {
      setMessage("Please enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const result = await confirmSignIn({
        challengeResponse: newPassword,
      });

      if (result.isSignedIn) {
        await onLoginSuccess();
        return;
      }

      setMessage(
        "Password updated, but sign-in is not complete. Please try again."
      );
    } catch (error) {
      console.error("Password update failed:", error);
      setMessage(error.message || "Could not set the new password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Brand */}
        <div className="brand">
          <div className="brand-icon">🏢</div>

          <div>
            <h1>CherryHomes</h1>
            <p>Apartment Maintenance</p>
          </div>
        </div>

        {!requiresNewPassword ? (
          <>
            <div className="auth-heading">
              <h2>Welcome back 🍒</h2>
              <p>
                Sign in to manage your apartment maintenance requests.
              </p>
            </div>

            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email address</label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="password">Password</label>

                  <button
                    type="button"
                    className="forgot-button"
                  >
                    Forgot password?
                  </button>
                </div>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {message && (
              <div className="auth-message">
                {message}
              </div>
            )}

            <div className="divider">
              <span>OR</span>
            </div>

            <p className="switch-text">
              New to CherryHomes?{" "}
              <button
                type="button"
                className="link-button"
                onClick={onSwitchToRegister}
              >
                Create an account
              </button>
            </p>

            <p className="demo-note">
              Residents can create their own accounts.
            </p>
          </>
        ) : (
          <>
            <div className="auth-heading">
              <h2>Create your password 🔐</h2>

              <p>
                This is your first login. Please replace the temporary
                password with a new password.
              </p>
            </div>

            <form
              onSubmit={handleNewPassword}
              className="auth-form"
            >
              <div className="form-group">
                <label htmlFor="newPassword">
                  New password
                </label>

                <input
                  id="newPassword"
                  type="password"
                  placeholder="Enter a new password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading
                  ? "Updating password..."
                  : "Set Password"}
              </button>
            </form>

            {message && (
              <div className="auth-message">
                {message}
              </div>
            )}
          </>
        )}

      </div>

      <div className="auth-decoration">
        <span>🍒</span>
        <span>🏠</span>
        <span>🍒</span>
      </div>
    </div>
  );
}

export default Login;