import { useCallback, useEffect, useState } from "react";
import AdminComplaints from "../admin/AdminComplaints";
import AdminWorkers from "../admin/AdminWorkers";
import AdminAnalytics from "../admin/AdminAnalytics";

const API_URL =
  "https://w7ngdx1tbg.execute-api.ap-south-1.amazonaws.com/dev";

function AdminDashboard({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");

  const [stats, setStats] = useState({
    total: 0,
    reported: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);

      const response = await fetch(`${API_URL}/complaints`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load complaint statistics."
        );
      }

      const complaints = data.complaints || [];

      setStats({
        total: complaints.length,

        reported: complaints.filter(
          (complaint) => complaint.status === "REPORTED"
        ).length,

        assigned: complaints.filter(
          (complaint) => complaint.status === "ASSIGNED"
        ).length,

        inProgress: complaints.filter(
          (complaint) => complaint.status === "IN PROGRESS"
        ).length,

        resolved: complaints.filter(
          (complaint) => complaint.status === "RESOLVED"
        ).length,

        closed: complaints.filter(
          (complaint) => complaint.status === "CLOSED"
        ).length,
      });
    } catch (error) {
      console.error(
        "Failed to load admin statistics:",
        error
      );
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStats();
  }, [loadStats]);

  if (page === "complaints") {
    return (
      <AdminComplaints
        onBack={() => setPage("dashboard")}
      />
    );
  }

  if (page === "workers") {
    return (
      <AdminWorkers
        onBack={() => setPage("dashboard")}
      />
    );
  }

  if (page === "analytics") {
  return (
    <AdminAnalytics
      onBack={() => setPage("dashboard")}
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
            <p>Admin Portal</p>
          </div>
        </div>

        <div className="dashboard-heading">
          <h2>Admin Dashboard 👨‍💼</h2>

          <p>
            Manage apartment maintenance operations.
          </p>
        </div>

        {/* Complaint Statistics */}
        <div className="dashboard-stats admin-dashboard-stats">

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              📋
            </div>

            <div>
              <span>Total Complaints</span>
              <strong>
                {statsLoading ? "—" : stats.total}
              </strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              📝
            </div>

            <div>
              <span>Reported</span>
              <strong>
                {statsLoading ? "—" : stats.reported}
              </strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              👷
            </div>

            <div>
              <span>Assigned</span>
              <strong>
                {statsLoading ? "—" : stats.assigned}
              </strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              🔧
            </div>

            <div>
              <span>In Progress</span>
              <strong>
                {statsLoading ? "—" : stats.inProgress}
              </strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              ✅
            </div>

            <div>
              <span>Resolved</span>
              <strong>
                {statsLoading ? "—" : stats.resolved}
              </strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              🏁
            </div>

            <div>
              <span>Closed</span>
              <strong>
                {statsLoading ? "—" : stats.closed}
              </strong>
            </div>
          </div>

        </div>

        <div className="dashboard-actions">

          <button
            type="button"
            className="dashboard-action"
            onClick={() => setPage("complaints")}
          >
            📋
            <span>View All Complaints</span>
          </button>

          <button
            type="button"
            className="dashboard-action"
            onClick={() => setPage("workers")}
          >
            👷
            <span>Manage Workers</span>
          </button>

          <button
            type="button"
            className="dashboard-action"
            onClick={() => setPage("analytics")}
          >
            📊
            <span>View Analytics</span>
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
        <span>🏢</span>
        <span>🍒</span>
      </div>
    </div>
  );
}

export default AdminDashboard;