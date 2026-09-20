import { useState } from "react";
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";

function VerifyEmail({ email, onVerified, onBackToLogin }) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (event) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      if (isSignUpComplete) {
        setMessage("Email verified successfully!");

        setTimeout(() => {
          onVerified();
        }, 1000);
      }
    } catch (error) {
      setMessage(error.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setMessage("");

    try {
      await resendSignUpCode({
        username: email,
      });

      setMessage("A new verification code has been sent.");
    } catch (error) {
      setMessage(error.message || "Could not resend the code.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <div className="brand-icon">🏢</div>

          <div>
            <h1>CherryHomes</h1>
            <p>Apartment Maintenance</p>
          </div>
        </div>

        <div className="auth-heading">
          <h2>Verify your email 🍒</h2>

          <p>
            We've sent a verification code to:
          </p>

          <strong>{email}</strong>
        </div>

        <form onSubmit={handleVerify} className="auth-form">
          <div className="form-group">
            <label htmlFor="verification-code">
              Verification code
            </label>

            <input
              id="verification-code"
              type="text"
              inputMode="numeric"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify email"}
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
          Didn't receive the code?{" "}
          <button
            type="button"
            className="link-button"
            onClick={handleResend}
          >
            Resend code
          </button>
        </p>

        <p className="switch-text" style={{ marginTop: "12px" }}>
          <button
            type="button"
            className="link-button"
            onClick={onBackToLogin}
          >
            Back to login
          </button>
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

export default VerifyEmail;