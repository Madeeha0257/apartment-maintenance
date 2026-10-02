import { useCallback, useEffect, useState } from "react";
import WorkerComplaintDetails from "./WorkerComplaintDetails";

const API_URL =
  "https://w7ngdx1tbg.execute-api.ap-south-1.amazonaws.com/dev";

function WorkerAssignedRequests({ user, onBack , statusFilter = null,
  title = "Assigned Requests",
  description = "View maintenance requests assigned to you."}) {
  const [requests, setRequests] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssignedRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Find this worker's Worker ID
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

      // Load all complaints
      const complaintsResponse = await fetch(`${API_URL}/complaints`);
      const complaintsData = await complaintsResponse.json();

      if (!complaintsResponse.ok) {
        throw new Error(
          complaintsData.error || "Failed to load maintenance requests."
        );
      }

      // Keep only complaints assigned to this worker
      const assignedRequests = (complaintsData.complaints || []).filter(
  (complaint) => {
    const assignedToWorker =
      complaint.assignedWorkerId === currentWorker.workerId;

    const matchesStatus =
        !statusFilter ||
        (Array.isArray(statusFilter)
            ? statusFilter.includes(complaint.status)
            : complaint.status === statusFilter);

    return assignedToWorker && matchesStatus;
  }
);

      setRequests(assignedRequests);
    } catch (error) {
      console.error("Failed to load assigned requests:", error);
      setError(
        error.message || "Failed to load assigned maintenance requests."
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAssignedRequests();
  }, [loadAssignedRequests]);


  if (selectedComplaintId) {
    return (
        <WorkerComplaintDetails
        complaintId={selectedComplaintId}
                    onBack={async () => {
                setSelectedComplaintId(null);
                await loadAssignedRequests();
            }}  
        />
    );
    }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <p className="admin-eyebrow">CherryHomes · Worker</p>

          <h1>{title}</h1>

            <p>{description}</p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={onBack}
        >
          ← Dashboard
        </button>
      </div>

      {error && (
        <div className="manage-error">
          {error}
        </div>
      )}

      <div className="admin-table-card">
        <div className="admin-toolbar">
          <div>
            <h2>{title}</h2>

<p>{description}</p>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Reported At</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="admin-empty-state">
                    Loading assigned requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="admin-empty-state">
                    No maintenance requests are currently assigned to you.
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.complaintId}>
                    <td>
                        <button
                            type="button"
                            className="link-button"
                            onClick={() =>
                            setSelectedComplaintId(request.complaintId)
                            }
                        >
                            <strong>{request.complaintId}</strong>
                        </button>
                    </td>

                    <td>{request.category || "—"}</td>

                    <td>{request.priority || "—"}</td>

                    <td>
                      <span className="worker-status-badge">
                        {request.status || "—"}
                      </span>
                    </td>

                    <td>
                      {request.createdAt
                        ? new Date(
                            request.createdAt
                          ).toLocaleString()
                        : "—"}
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

export default WorkerAssignedRequests;