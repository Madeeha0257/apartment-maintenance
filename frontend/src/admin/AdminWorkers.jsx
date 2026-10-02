import { useCallback, useEffect, useState } from "react";

const API_URL =
  "https://w7ngdx1tbg.execute-api.ap-south-1.amazonaws.com/dev";

function AdminWorkers({ onBack }) {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [workerEmail, setWorkerEmail] = useState("");
  const [addingWorker, setAddingWorker] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const loadWorkers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/workers`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load workers.");
      }

      setWorkers(data.workers || []);
    } catch (error) {
      console.error("Failed to load workers:", error);
      setError(error.message || "Failed to load workers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadWorkers();
  }, [loadWorkers]);

  const handleAddWorker = async (event) => {
    event.preventDefault();

    const email = workerEmail.trim().toLowerCase();

    if (!email) {
      setError("Worker email is required.");
      return;
    }

    try {
      setAddingWorker(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(`${API_URL}/workers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create worker.");
      }

      setWorkerEmail("");
      setShowAddForm(false);
      setSuccessMessage("Worker added successfully.");

      await loadWorkers();
    } catch (error) {
      console.error("Failed to add worker:", error);
      setError(error.message || "Failed to add worker.");
    } finally {
      setAddingWorker(false);
    }
  };

  const handleDeleteWorker = async (worker) => {
    const confirmed = window.confirm(
      `Remove worker "${worker.username}" from CherryHomes?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_URL}/workers/${encodeURIComponent(worker.username)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove worker.");
      }

      setSuccessMessage("Worker removed successfully.");

      await loadWorkers();
    } catch (error) {
      console.error("Failed to remove worker:", error);
      setError(error.message || "Failed to remove worker.");
    }
  };

  const activeWorkers = workers.filter(
    (worker) => worker.status === "Active"
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <p className="admin-eyebrow">CherryHomes · Admin</p>
          <h1>Manage Workers</h1>
          <p>View and manage workers available for maintenance assignments.</p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={onBack}
        >
          ← Dashboard
        </button>
      </div>

      <div className="admin-summary">
        <div className="admin-summary-card">
          <span>Total Workers</span>
          <strong>{workers.length}</strong>
        </div>

        <div className="admin-summary-card">
          <span>Active Workers</span>
          <strong>{activeWorkers.length}</strong>
        </div>

        <div className="admin-summary-card">
          <span>Available for Assignment</span>
          <strong>{activeWorkers.length}</strong>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-toolbar worker-toolbar">
          <div>
            <h2>Workers</h2>
            <p>Manage registered maintenance workers.</p>
          </div>

          <button
            type="button"
            className="primary-button worker-add-toggle"
            onClick={() => {
              setShowAddForm((current) => !current);
              setError("");
              setSuccessMessage("");
            }}
          >
            {showAddForm ? "Cancel" : "+ Add Worker"}
          </button>
        </div>

        {showAddForm && (
          <form className="worker-add-form" onSubmit={handleAddWorker}>
            <div className="manage-form-group">
              <label htmlFor="workerEmail">Worker Email</label>

              <input
                id="workerEmail"
                type="email"
                value={workerEmail}
                onChange={(event) => setWorkerEmail(event.target.value)}
                placeholder="worker@example.com"
                required
              />

              <small>
                The email address will be used as the worker's Cognito
                username.
              </small>
            </div>

            <button
              type="submit"
              className="primary-button worker-submit-button"
              disabled={addingWorker}
            >
              {addingWorker ? "Adding..." : "Add Worker"}
            </button>
          </form>
        )}

        {successMessage && (
          <div className="manage-success">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="manage-error">
            {error}
          </div>
        )}

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Worker ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="admin-empty-state">
                    Loading workers...
                  </td>
                </tr>
              ) : workers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="admin-empty-state">
                    No workers found.
                  </td>
                </tr>
              ) : (
                workers.map((worker) => (
                  <tr key={worker.username}>
                    <td>
                      <strong>{worker.workerId}</strong>
                    </td>

                    <td>{worker.username}</td>

                    <td>{worker.email || "—"}</td>

                    <td>
                      <span className="worker-status-badge">
                        {worker.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDeleteWorker(worker)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminWorkers;