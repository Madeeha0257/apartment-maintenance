import { useState } from "react";
import { signUp } from "aws-amplify/auth";

function Register({ onSwitchToLogin, onRegistrationComplete }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const { nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });

      if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        onRegistrationComplete(email);
      } else {
        setMessage("Account created successfully.");
      }
    } catch (error) {
      setMessage(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">

        {/* Brand */}
        <div className="brand">
          <div className="brand-icon">🏢</div>

          <div>
            <h1>CherryHomes</h1>
            <p>Apartment Maintenance</p>
          </div>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h2>Create your account 🍒</h2>

          <p>
            Join your apartment's maintenance platform and keep track of
            your requests.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="auth-form">

          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Full name</label>

            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="register-email">
              Email address
            </label>

            <input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {/* Role Information */}
          <div className="role-display">
            <span className="role-icon">🏠</span>

            <div>
              <strong>Resident account</strong>

              <p>
                New registrations are created as residents.
              </p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create account"}
          </button>

        </form>

        {/* Message */}
        {message && (
          <div className="auth-message">
            {message}
          </div>
        )}

        {/* Divider */}
        <div className="divider">
          <span>OR</span>
        </div>

        {/* Login */}
        <p className="switch-text">
          Already have an account?{" "}

          <button
            type="button"
            className="link-button"
            onClick={onSwitchToLogin}
          >
            Sign in
          </button>
        </p>

      </div>

      {/* Background Decorations */}
      <div className="auth-decoration">
        <span>🍒</span>
        <span>🏠</span>
        <span>🍒</span>
      </div>
    </div>
  );
}

export default Register;