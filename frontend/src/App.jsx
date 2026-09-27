import { useEffect, useState } from "react";
import {
  getCurrentUser,
  fetchAuthSession,
  signOut,
} from "aws-amplify/auth";

import Login from "./auth/Login";
import Register from "./auth/Register";
import VerifyEmail from "./auth/VerifyEmail";

import ResidentDashboard from "./dashboards/ResidentDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import WorkerDashboard from "./dashboards/WorkerDashboard";

function App() {
  const [page, setPage] = useState("login");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for an existing login session when the app starts
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();

        const groups =
          session.tokens?.idToken?.payload?.["cognito:groups"] || [];

        let detectedRole = null;

        if (groups.includes("Admins")) {
          detectedRole = "admin";
        } else if (groups.includes("Workers")) {
          detectedRole = "worker";
        } else if (groups.includes("Residents")) {
          detectedRole = "resident";
        }

        setUser(currentUser);
        setRole(detectedRole);
        setPage("dashboard");
      } catch {
        setUser(null);
        setRole(null);
        setPage("login");
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Called after successful login
  const handleLoginSuccess = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();

      const groups =
        session.tokens?.idToken?.payload?.["cognito:groups"] || [];

      let detectedRole = null;

      if (groups.includes("Admins")) {
        detectedRole = "admin";
      } else if (groups.includes("Workers")) {
        detectedRole = "worker";
      } else if (groups.includes("Residents")) {
        detectedRole = "resident";
      }

      setUser(currentUser);
      setRole(detectedRole);
      setPage("dashboard");
    } catch (error) {
      console.error("Could not load user session:", error);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut();

      setUser(null);
      setRole(null);
      setPage("login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Registration completed
  const handleRegistrationComplete = (email) => {
    setVerificationEmail(email);
    setPage("verify");
  };

  // Loading screen
  if (loading) {
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
            <h2>Loading 🍒</h2>
            <p>Checking your session...</p>
          </div>
        </div>
      </div>
    );
  }

  // Registration page
  if (page === "register") {
    return (
      <Register
        onSwitchToLogin={() => setPage("login")}
        onRegistrationComplete={handleRegistrationComplete}
      />
    );
  }

  // Email verification page
  if (page === "verify") {
    return (
      <VerifyEmail
        email={verificationEmail}
        onVerified={() => setPage("login")}
        onBackToLogin={() => setPage("login")}
      />
    );
  }

  // Role-based dashboards
  if (page === "dashboard") {
    // Resident dashboard
    if (role === "resident") {
      return (
        <ResidentDashboard
          user={user}
          onLogout={handleLogout}
        />
      );
    }

    // Admin dashboard
    if (role === "admin") {
      return (
        <AdminDashboard
          user={user}
          onLogout={handleLogout}
        />
      );
    }

    // Worker dashboard
    if (role === "worker") {
      return (
        <WorkerDashboard
          user={user}
          onLogout={handleLogout}
        />
      );
    }

    // Authenticated but no role assigned
    return (
      <div className="dashboard-page">
        <div className="dashboard-card">

          <div className="brand">
            <div className="brand-icon">🏢</div>

            <div>
              <h1>CherryHomes</h1>
              <p>Apartment Maintenance</p>
            </div>
          </div>

          <div className="dashboard-heading">
            <h2>Account Setup Required</h2>

            <p>
              Your account is authenticated, but no application
              role has been assigned yet.
            </p>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Sign out
          </button>

        </div>
      </div>
    );
  }

  // Login page
  return (
    <Login
      onSwitchToRegister={() => setPage("register")}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

export default App;