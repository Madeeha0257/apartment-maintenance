function AdminDashboard({ user, onLogout }) {
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

        <div className="dashboard-actions">

          <button className="dashboard-action">
            📋
            <span>View All Complaints</span>
          </button>

          <button className="dashboard-action">
            👷
            <span>Manage Workers</span>
          </button>

          <button className="dashboard-action">
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