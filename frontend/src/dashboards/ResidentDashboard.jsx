function ResidentDashboard({ user, onLogout }) {
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

        <div className="dashboard-actions">

          <button className="dashboard-action">
            🛠️
            <span>Submit Maintenance Request</span>
          </button>

          <button className="dashboard-action">
            📋
            <span>My Active Requests</span>
          </button>

          <button className="dashboard-action">
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