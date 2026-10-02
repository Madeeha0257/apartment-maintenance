import { useState } from "react";
import WorkerAssignedRequests from "../worker/WorkerAssignedRequests";
import WorkerInProgress from "../worker/WorkerInProgress";
import WorkerCompleted from "../worker/WorkerCompleted";

function WorkerDashboard({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");

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