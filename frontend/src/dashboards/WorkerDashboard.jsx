import { useCallback, useEffect, useState } from "react";
import WorkerAssignedRequests from "../worker/WorkerAssignedRequests";
import WorkerInProgress from "../worker/WorkerInProgress";
import WorkerCompleted from "../worker/WorkerCompleted";

const API_URL =
  "https://w7ngdx1tbg.execute-api.ap-south-1.amazonaws.com/dev";

function WorkerDashboard({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");

  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    completed: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);

      const workersResponse = await fetch(`${API_URL}/workers`);
      const workersData = await workersResponse.json();

      if (!workersResponse.ok) {
        throw new Error(
          workersData.error || "Failed to load worker information."
        );
      }

      const currentWorker = (workersData.workers || []).find(
        (worker) => worker.username === user?.username
      );

      if (!currentWorker) {
        throw new Error("Worker account could not be found.");
      }

      const complaintsResponse = await fetch(`${API_URL}/complaints`);
      const complaintsData = await complaintsResponse.json();

      if (!complaintsResponse.ok) {
        throw new Error(
          complaintsData.error ||
            "Failed to load maintenance requests."
        );
      }

      const assignedRequests = (
        complaintsData.complaints || []
      ).filter(
        (complaint) =>
          complaint.assignedWorkerId === currentWorker.workerId
      );

      setStats({
        assigned: assignedRequests.length,

        inProgress: assignedRequests.filter(
          (complaint) => complaint.status === "IN PROGRESS"
        ).length,

        completed: assignedRequests.filter(
          (complaint) =>
            complaint.status === "RESOLVED" ||
            complaint.status === "CLOSED"
        ).length,
      });
    } catch (error) {
      console.error(
        "Failed to load worker statistics:",
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

  if (page === "assigned") {
    return (
      <WorkerAssignedRequests
        user={user}
        onBack={() => setPage("dashboard")}
      />
    );
  }

  if (page === "progress") {
    return (
      <WorkerInProgress
        user={user}
        onBack={() => setPage("dashboard")}
      />
    );
  }

  if (page === "completed") {
    return (
      <WorkerCompleted
        user={user}
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
            <p>Worker Portal</p>
          </div>
        </div>

        <div className="dashboard-heading">
          <h2>Worker Dashboard 🔧</h2>

          <p>
            View and manage your assigned maintenance requests.
          </p>
        </div>

        {/* Worker Statistics */}
        <div className="dashboard-stats">

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              📋
            </div>

            <div>
              <span>Assigned Requests</span>

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
              <span>Completed</span>

              <strong>
                {statsLoading ? "—" : stats.completed}
              </strong>
            </div>
          </div>

        </div>

        <div className="dashboard-actions">

          <button
            type="button"
            className="dashboard-action"
            onClick={() => setPage("assigned")}
          >
            📋
            <span>Assigned Requests</span>
          </button>

          <button
            type="button"
            className="dashboard-action"
            onClick={() => setPage("progress")}
          >
            🔧
            <span>Requests In Progress</span>
          </button>

          <button
            type="button"
            className="dashboard-action"
            onClick={() => setPage("completed")}
          >
            ✅
            <span>Completed Requests</span>
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
        <span>🔧</span>
        <span>🍒</span>
      </div>
    </div>
  );
}

export default WorkerDashboard;