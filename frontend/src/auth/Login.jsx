import { useState } from "react";
import { signIn } from "aws-amplify/auth";

function Login({ onSwitchToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const { isSignedIn } = await signIn({
        username: email,
        password,
      });

      if (isSignedIn) {
        await onLoginSuccess();
      }
    } catch (error) {
      setMessage(error.message || "Login failed.");
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

        <div className="auth-heading">
          <h2>Welcome back 🍒</h2>
          <p>Sign in to manage your apartment maintenance requests.</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <button type="button" className="forgot-button">
                Forgot password?
              </button>
            </div>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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