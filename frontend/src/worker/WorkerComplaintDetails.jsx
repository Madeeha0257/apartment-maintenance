import { useEffect, useState } from "react";

const API_URL =
  "https://w7ngdx1tbg.execute-api.ap-south-1.amazonaws.com/dev";

function WorkerComplaintDetails({ complaintId, onBack }) {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
const [resolutionNotes, setResolutionNotes] = useState("");
const [saving, setSaving] = useState(false);
const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadComplaint = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/complaints/${encodeURIComponent(complaintId)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load complaint."
          );
        }

        setComplaint(data.complaint);
        setStatus(data.complaint.status || "");
        setResolutionNotes(data.complaint.resolutionNotes || "");
      } catch (error) {
        console.error("Failed to load complaint:", error);
        setError(error.message || "Failed to load complaint.");
      } finally {
        setLoading(false);
      }
    };

    loadComplaint();
  }, [complaintId]);

  const handleUpdate = async (event) => {
  event.preventDefault();

  try {
    setSaving(true);
    setError("");
    setSuccessMessage("");

    const response = await fetch(
      `${API_URL}/complaints/${encodeURIComponent(complaintId)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          resolutionNotes: resolutionNotes.trim() || null,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to update complaint."
      );
    }

    setComplaint(data.complaint);
    setSuccessMessage("Maintenance request updated successfully.");
  } catch (error) {
    console.error("Failed to update complaint:", error);
    setError(error.message || "Failed to update complaint.");
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-header">
          <div>
            <p className="admin-eyebrow">CherryHomes · Worker</p>
            <h1>Complaint Details</h1>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={onBack}
          >
            ← Assigned Requests
          </button>
        </div>

        <div className="admin-table-card">
          <div className="worker-detail-loading">
            Loading complaint details...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-header">
          <div>
            <p className="admin-eyebrow">CherryHomes · Worker</p>
            <h1>Complaint Details</h1>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={onBack}
          >
            ← Assigned Requests
          </button>
        </div>

        <div className="manage-error">
          {error}
        </div>
      </div>
    );
  }

  if (!complaint) {
    return null;
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div>
          <p className="admin-eyebrow">CherryHomes · Worker</p>

          <h1>Complaint Details</h1>

          <p>
            Review this maintenance request before working on it.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={onBack}
        >
          ← Assigned Requests
        </button>
      </div>

      {/* Complaint Summary */}
      <div className="worker-detail-card">
        <div className="worker-detail-header">
          <div>
            <span className="worker-detail-label">
              Complaint ID
            </span>

            <h2>{complaint.complaintId}</h2>

            <p>
              Reported{" "}
              {complaint.createdAt
                ? new Date(
                    complaint.createdAt
                  ).toLocaleString()
                : "—"}
            </p>
          </div>

          <span className="worker-status-badge worker-status-large">
            {complaint.status || "—"}
          </span>
        </div>
      </div>

      {/* Basic Information */}
      <div className="worker-detail-card">
        <div className="worker-section-heading">
          <h2>Request Information</h2>
          <p>Details provided with the maintenance request.</p>
        </div>

        <div className="worker-info-grid">
          <div className="worker-info-item">
            <span>Category</span>
            <strong>{complaint.category || "—"}</strong>
          </div>

          <div className="worker-info-item">
            <span>Priority</span>
            <strong>{complaint.priority || "—"}</strong>
          </div>

          <div className="worker-info-item worker-info-wide">
            <span>Resident</span>
            <strong>{complaint.residentEmail || "—"}</strong>
          </div>

          <div className="worker-info-item">
            <span>Assigned Worker</span>
            <strong>
              {complaint.assignedWorkerId || "Unassigned"}
            </strong>
          </div>
        </div>
      </div>

      {/* Issue Description */}
      <div className="worker-detail-card">
        <div className="worker-section-heading">
          <h2>Issue Description</h2>
        </div>

        <div className="worker-description-box">
          {complaint.description || "No description provided."}
        </div>
      </div>

      {/* Photo */}
      {complaint.photoKey && (
  <div className="worker-detail-card">
    <div className="worker-section-heading">
      <h2>Issue Photo</h2>
      <p>Photo submitted by the resident.</p>
    </div>

    <div className="worker-photo-preview">
      <img
        src={`https://apartment-maintenance.s3.ap-south-1.amazonaws.com/${complaint.photoKey}`}
        alt="Maintenance issue"
      />
    </div>
  </div>
)}

      {/* Resolution Notes */}
      {complaint.resolutionNotes && (
        <div className="worker-detail-card">
          <div className="worker-section-heading">
            <h2>Resolution Notes</h2>
          </div>

          <div className="worker-description-box">
            {complaint.resolutionNotes}
          </div>
        </div>
      )}

      <div className="worker-detail-card">
  <div className="worker-section-heading">
    <h2>Update Request</h2>
    <p>
      Update the progress of this maintenance request.
    </p>
  </div>

  <form onSubmit={handleUpdate} className="worker-update-form">

    <div className="worker-form-group">
      <label htmlFor="worker-status">
        Status
      </label>

      <select
        id="worker-status"
        value={status}
        onChange={(event) =>
          setStatus(event.target.value)
        }
        required
      >
        <option value="ASSIGNED">
          Assigned
        </option>

        <option value="IN PROGRESS">
          In Progress
        </option>

        <option value="RESOLVED">
          Resolved
        </option>
      </select>
    </div>

    <div className="worker-form-group">
      <label htmlFor="resolution-notes">
        Resolution Notes
      </label>

      <textarea
        id="resolution-notes"
        value={resolutionNotes}
        onChange={(event) =>
          setResolutionNotes(event.target.value)
        }
        placeholder="Describe the work completed or progress made..."
        rows="5"
      />
    </div>

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

    <button
      type="submit"
      className="primary-button"
      disabled={saving}
    >
      {saving ? "Saving..." : "Save Update"}
    </button>

  </form>
</div>

    </div>
  );
}

export default WorkerComplaintDetails;