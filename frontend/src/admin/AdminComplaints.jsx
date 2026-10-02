import { useCallback, useEffect, useState } from "react";

const API_URL =
  "https://w7ngdx1tbg.execute-api.ap-south-1.amazonaws.com/dev";

function AdminComplaints({ onBack }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [editPriority, setEditPriority] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editWorker, setEditWorker] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // NEW: Real workers loaded from Cognito through the API
  const [workers, setWorkers] = useState([]);

  const loadComplaints = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/complaints`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load complaints.");
      }

      setComplaints(data.complaints || []);
    } catch (error) {
      console.error("Failed to load complaints:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // NEW: Load real workers
  const loadWorkers = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/workers`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load workers.");
      }

      setWorkers(data.workers || []);
    } catch (error) {
      console.error("Failed to load workers:", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadComplaints();

    loadWorkers();
  }, [loadComplaints, loadWorkers]);

  const openManagePanel = (complaint) => {
    setSelectedComplaint(complaint);
    setEditPriority(complaint.priority || "MEDIUM");
    setEditStatus(complaint.status || "REPORTED");
    setEditWorker(complaint.assignedWorkerId || "");
    setEditNotes(complaint.resolutionNotes || "");
    setSaveMessage("");
  };

  const closeManagePanel = () => {
    setSelectedComplaint(null);
    setSaveMessage("");
  };

  const handleSaveChanges = async () => {
    if (!selectedComplaint) return;

    try {
      setSaving(true);
      setSaveMessage("");

      const response = await fetch(
        `${API_URL}/complaints/${selectedComplaint.complaintId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priority: editPriority,
            status: editStatus,
            assignedWorkerId: editWorker.trim() || null,
            resolutionNotes: editNotes.trim() || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update complaint.");
      }

      setSaveMessage("Complaint updated successfully.");

      await loadComplaints();

      setTimeout(() => {
        setSelectedComplaint(null);
        setSaveMessage("");
      }, 800);
    } catch (error) {
      console.error("Failed to update complaint:", error);
      setSaveMessage(error.message || "Failed to update complaint.");
    } finally {
      setSaving(false);
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      complaint.complaintId?.toLowerCase().includes(searchText) ||
      complaint.title?.toLowerCase().includes(searchText) ||
      complaint.residentEmail?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" ||
      complaint.status === statusFilter;

    const matchesPriority =
      priorityFilter === "ALL" ||
      complaint.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalComplaints = complaints.length;

  const activeComplaints = complaints.filter(
    (complaint) =>
      complaint.status !== "RESOLVED" &&
      complaint.status !== "CLOSED"
  ).length;

  const highPriorityComplaints = complaints.filter(
    (complaint) =>
      complaint.priority === "HIGH" ||
      complaint.priority === "URGENT"
  ).length;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <p className="admin-eyebrow">CherryHomes · Admin</p>
          <h1>Maintenance Complaints</h1>
          <p>Review and manage apartment maintenance requests.</p>
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
          <span>Total Complaints</span>
          <strong>{totalComplaints}</strong>
        </div>

        <div className="admin-summary-card">
          <span>Active Requests</span>
          <strong>{activeComplaints}</strong>
        </div>

        <div className="admin-summary-card">
          <span>High Priority</span>
          <strong>{highPriorityComplaints}</strong>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search by ID, title or resident..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="REPORTED">Reported</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
        >
          <option value="ALL">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      <div className="admin-table-card">
        {loading ? (
          <div className="admin-empty">
            Loading complaints...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="admin-empty">
            No complaints match your filters.
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Complaint</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Resident</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.complaintId}>
                    <td>
                      <strong>{complaint.complaintId}</strong>
                    </td>

                    <td>{complaint.title}</td>

                    <td>{complaint.category}</td>

                    <td>
                      <span
                        className={`priority-badge priority-${complaint.priority.toLowerCase()}`}
                      >
                        {complaint.priority}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge status-${complaint.status
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {complaint.status}
                      </span>
                    </td>

                    <td>{complaint.residentEmail}</td>

                    <td>
                      <button
                        type="button"
                        className="manage-button"
                        onClick={() => openManagePanel(complaint)}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedComplaint && (
        <div className="manage-overlay">
          <div className="manage-modal">
            <div className="manage-modal-header">
              <div>
                <p className="admin-eyebrow">
                  Complaint Management
                </p>

                <h2>{selectedComplaint.title}</h2>

                <span>{selectedComplaint.complaintId}</span>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeManagePanel}
              >
                ×
              </button>
            </div>

            <div className="manage-complaint-info">
              <div>
                <span>Category</span>
                <strong>{selectedComplaint.category}</strong>
              </div>

              <div>
                <span>Resident</span>
                <strong>{selectedComplaint.residentEmail}</strong>
              </div>
            </div>

            {selectedComplaint.photoKey && (
  <div className="admin-complaint-photo">
    <div className="manage-form-group">
      <label>Issue Photo</label>

      <div className="admin-photo-preview">
        <img
          src={`https://apartment-maintenance.s3.ap-south-1.amazonaws.com/${selectedComplaint.photoKey}`}
          alt="Maintenance issue"
        />
      </div>
    </div>
  </div>
)}

            <div className="manage-form">
              <div className="manage-form-group">
                <label htmlFor="edit-priority">
                  Priority
                </label>

                <select
                  id="edit-priority"
                  value={editPriority}
                  onChange={(event) =>
                    setEditPriority(event.target.value)
                  }
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="manage-form-group">
                <label htmlFor="edit-status">
                  Status
                </label>

                <select
                  id="edit-status"
                  value={editStatus}
                  onChange={(event) =>
                    setEditStatus(event.target.value)
                  }
                >
                  <option value="REPORTED">Reported</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              {/* CHANGED: Worker ID text box → real worker dropdown */}
              <div className="manage-form-group">
                <label htmlFor="edit-worker">
                  Assigned Worker
                </label>

                <select
                  id="edit-worker"
                  value={editWorker}
                  onChange={(event) =>
                    setEditWorker(event.target.value)
                  }
                >
                  <option value="">
                    Unassigned
                  </option>

                  {workers.map((worker) => (
                    <option
                      key={worker.workerId}
                      value={worker.workerId}
                    >
                      {worker.workerId} — {worker.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="manage-form-group">
                <label htmlFor="edit-notes">
                  Resolution Notes
                </label>

                <textarea
                  id="edit-notes"
                  rows="4"
                  placeholder="Add resolution notes if applicable..."
                  value={editNotes}
                  onChange={(event) =>
                    setEditNotes(event.target.value)
                  }
                />
              </div>
            </div>

            {saveMessage && (
              <div
                className={
                  saveMessage.includes("successfully")
                    ? "manage-success"
                    : "manage-error"
                }
              >
                {saveMessage}
              </div>
            )}

            <div className="manage-modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={closeManagePanel}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={handleSaveChanges}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminComplaints;