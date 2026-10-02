import { useCallback, useEffect, useState } from "react";

import StatusTimeline from "./StatusTimeline";

const API_URL =
  "https://w7ngdx1tbg.execute-api.ap-south-1.amazonaws.com/dev";

function MyActiveRequests({ user, onBack }) {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadActiveRequests = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const residentId = user?.userId || user?.username;

      if (!residentId) {
        throw new Error("Could not identify the resident.");
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

      const activeRequests = (data.complaints || []).filter(
        (complaint) =>
          complaint.status === "REPORTED" ||
          complaint.status === "ASSIGNED" ||
          complaint.status === "IN PROGRESS"
      );

      setComplaints(activeRequests);
    } catch (error) {
      console.error(
        "Failed to load active requests:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while loading requests."
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadActiveRequests();
  }, [loadActiveRequests]);

  const getStatusClass = (status) => {
    switch (status) {
      case "REPORTED":
        return "status-reported";

      case "ASSIGNED":
        return "status-assigned";

      case "IN PROGRESS":
        return "status-progress";

      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "—";
    }

    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  /* =====================================================
     DETAIL VIEW
     ===================================================== */

  if (selectedComplaint) {
    const complaint = selectedComplaint;

    return (
      <div className="dashboard-page">

        <div className="dashboard-card complaint-detail-card">

          {/* Brand */}

          <div className="brand">

            <div className="brand-icon">
              🏢
            </div>

            <div>
              <h1>CherryHomes</h1>
              <p>Resident Portal</p>
            </div>

          </div>


          {/* Back Button */}

          <button
            type="button"
            className="detail-back-button"
            onClick={() =>
              setSelectedComplaint(null)
            }
          >
            ← Back to Active Requests
          </button>


          {/* Request Header */}

          <div className="detail-header">

            <div>

              <span className="detail-label">
                MAINTENANCE REQUEST
              </span>

              <h2>
                {complaint.title}
              </h2>

              <span className="complaint-id">
                {complaint.complaintId}
              </span>

            </div>


            <span
              className={`request-status ${getStatusClass(
                complaint.status
              )}`}
            >
              {complaint.status}
            </span>

          </div>


          {/* Status Progress */}

          <div className="status-section">

            <h3>
              Request Progress
            </h3>

            <StatusTimeline
              status={complaint.status}
            />

          </div>


          {/* Request Information */}

          <div className="detail-info-grid">

            <div className="detail-info-box">

              <span>
                Category
              </span>

              <strong>
                {complaint.category}
              </strong>

            </div>


            <div className="detail-info-box">

              <span>
                Priority
              </span>

              <strong>
                {complaint.priority}
              </strong>

            </div>


            <div className="detail-info-box">

              <span>
                Submitted
              </span>

              <strong>
                {formatDate(
                  complaint.createdAt
                )}
              </strong>

            </div>


            <div className="detail-info-box">

              <span>
                Last Updated
              </span>

              <strong>
                {formatDate(
                  complaint.updatedAt
                )}
              </strong>

            </div>

          </div>


          {/* Description */}

          <div className="detail-description">

            <h3>
              Issue Description
            </h3>

            <p>
              {complaint.description}
            </p>

          </div>


          {/* Assigned Worker */}

          {complaint.assignedWorkerId && (
            <div className="assigned-worker">

              <span>
                Assigned Worker
              </span>

              <strong>
                {complaint.assignedWorkerId}
              </strong>

            </div>
          )}


          {/* Photo */}

          {complaint.photoKey && (
  <div className="photo-reference">
    <span>Issue Photo</span>

    <div className="resident-photo-preview">
      <img
        src={`https://apartment-maintenance.s3.ap-south-1.amazonaws.com/${complaint.photoKey}`}
        alt="Maintenance issue"
      />
    </div>
  </div>
)}

        </div>


        {/* Decorative Elements */}

        <div className="dashboard-decoration">

          <span>🍒</span>
          <span>🏠</span>
          <span>🍒</span>

        </div>

      </div>
    );
  }


  /* =====================================================
     ACTIVE REQUEST LIST
     ===================================================== */

  return (
    <div className="dashboard-page">

      <div className="dashboard-card complaint-list-card">

        {/* Brand */}

        <div className="brand">

          <div className="brand-icon">
            🏢
          </div>

          <div>
            <h1>CherryHomes</h1>
            <p>Resident Portal</p>
          </div>

        </div>


        {/* Page Heading */}

        <div className="dashboard-heading">

          <h2>
            My Active Requests 📋
          </h2>

          <p>
            Track maintenance requests that are
            currently being handled.
          </p>

        </div>


        {/* Loading */}

        {loading && (
          <div className="request-message">
            Loading your maintenance requests...
          </div>
        )}


        {/* Error */}

        {!loading && error && (
          <div className="auth-message">
            {error}
          </div>
        )}


        {/* Empty State */}

        {!loading &&
          !error &&
          complaints.length === 0 && (

            <div className="empty-state">

              <div className="empty-state-icon">
                ✨
              </div>

              <h3>
                No active requests
              </h3>

              <p>
                You currently have no maintenance
                requests being handled.
              </p>

            </div>

          )}


        {/* Active Requests */}

        {!loading &&
          !error &&
          complaints.length > 0 && (

            <div className="complaints-list">

              {complaints.map((complaint) => (

                <div
                  className="complaint-card"
                  key={complaint.complaintId}
                >

                  {/* Card Header */}

                  <div className="complaint-card-header">

                    <div>

                      <h3>
                        {complaint.title}
                      </h3>

                      <span className="complaint-id">
                        {complaint.complaintId}
                      </span>

                    </div>


                    <span
                      className={`request-status ${getStatusClass(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>

                  </div>


                  {/* Summary */}

                  <div className="complaint-summary">

                    <div>

                      <span>
                        Category
                      </span>

                      <strong>
                        {complaint.category}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Priority
                      </span>

                      <strong>
                        {complaint.priority}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Submitted
                      </span>

                      <strong>
                        {formatDate(
                          complaint.createdAt
                        )}
                      </strong>

                    </div>

                  </div>


                  {/* Status Progress */}

                  <div className="complaint-progress">

                    <span className="progress-title">
                      Request Progress
                    </span>

                    <StatusTimeline
                      status={complaint.status}
                    />

                  </div>


                  {/* Description */}

                  <div className="complaint-description">

                    <span>
                      Description
                    </span>

                    <p>
                      {complaint.description}
                    </p>

                  </div>


                  {/* Footer */}

                  <div className="complaint-card-footer">

                    <span className="request-preview">
                      Last updated{" "}
                      {formatDate(
                        complaint.updatedAt
                      )}
                    </span>


                    <button
                      type="button"
                      className="view-request-button"
                      onClick={() =>
                        setSelectedComplaint(
                          complaint
                        )
                      }
                    >
                      View Details →
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}


        {/* Bottom Buttons */}

        <div className="form-buttons">

          <button
            type="button"
            className="logout-button"
            onClick={onBack}
          >
            Back
          </button>


          <button
            type="button"
            className="primary-button"
            onClick={loadActiveRequests}
            disabled={loading}
          >
            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>

      </div>


      {/* Decorative Elements */}

      <div className="dashboard-decoration">

        <span>🍒</span>
        <span>🏠</span>
        <span>🍒</span>

      </div>

    </div>
  );
}

export default MyActiveRequests;