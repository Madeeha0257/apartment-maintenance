import { useCallback, useEffect, useState } from "react";
import ComplaintForm from "../complaints/ComplaintForm";
import MyActiveRequests from "../complaints/MyActiveRequests";
import RequestHistory from "../complaints/RequestHistory";

const API_URL =
  "https://w7ngdx1tbg.execute-api.ap-south-1.amazonaws.com/dev";

function ResidentDashboard({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    resolved: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);

      const residentId =
        user?.attributes?.sub || user?.username;

      if (!residentId) {
        throw new Error("Resident information is unavailable.");
      }

      const response = await fetch(
        `${API_URL}/complaints?residentId=${encodeURIComponent(
          residentId
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load maintenance requests."
        );
      }

      const complaints = data.complaints || [];

      setStats({
        total: complaints.length,

        active: complaints.filter(
          (complaint) =>
            complaint.status !== "RESOLVED" &&
            complaint.status !== "CLOSED"
        ).length,

        resolved: complaints.filter(
          (complaint) =>
            complaint.status === "RESOLVED" ||
            complaint.status === "CLOSED"
        ).length,
      });
    } catch (error) {
      console.error(
        "Failed to load resident statistics:",
        error
      );
    } finally {
      setStatsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStats();
  }, [loadStats]);

  if (page === "complaint") {
    return (
      <ComplaintForm
        user={user}
        onBack={() => {
          setPage("dashboard");
          loadStats();
        }}
      />
    );
  }

  if (page === "history") {
    return (
      <RequestHistory
        user={user}
        onBack={() => {
          setPage("dashboard");
          loadStats();
        }}
      />
    );
  }

  if (page === "active") {
    return (
      <MyActiveRequests
        user={user}
        onBack={() => {
          setPage("dashboard");
          loadStats();
        }}
      />
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">

        <div className="brand">
          <div className="brand-icon">🏢</div>

          <div>
            <h1>CherryHomes</h1>
            <p>Resident Portal</p>
          </div>
        </div>

        <div className="dashboard-heading">
          <h2>Welcome, Resident 🍒</h2>

          <p>
            Manage your apartment maintenance requests.
          </p>
        </div>

        {/* Resident Statistics */}
        <div className="dashboard-stats">

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              📋
            </div>

            <div>
              <span>Total Requests</span>

              <strong>
                {statsLoading ? "—" : stats.total}
              </strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              🔧
            </div>

            <div>
              <span>Active Requests</span>

              <strong>
                {statsLoading ? "—" : stats.active}
              </strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              ✅
            </div>

            <div>
              <span>Resolved Requests</span>

              <strong>
                {statsLoading ? "—" : stats.resolved}
              </strong>
            </div>
          </div>

        </div>

        <div className="dashboard-actions">

          <button
            type="button"
            className="dashboard-action"
            onClick={() => setPage("complaint")}
          >
            🛠️
            <span>Submit Maintenance Request</span>
          </button>

          <button
            type="button"
            className="dashboard-action"
            onClick={() => setPage("active")}
          >
            📋
            <span>My Active Requests</span>
          </button>

          <button
            type="button"
            className="dashboard-action"
            onClick={() => setPage("history")}
          >
            📜
            <span>Request History</span>
          </button>

        </div>

        <div className="dashboard-user">
          <span>Signed in as</span>
          <strong>{user?.username}</strong>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={onLogout}
        >
          Sign out
        </button>

      </div>

      <div className="dashboard-decoration">
        <span>🍒</span>
        <span>🏠</span>
        <span>🍒</span>
      </div>
    </div>
  );
}

export default ResidentDashboard;