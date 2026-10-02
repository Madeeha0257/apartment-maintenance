import { useEffect, useState } from "react";

const API_URL =
  "https://w7ngdx1tbg.execute-api.ap-south-1.amazonaws.com/dev";

function RequestHistory({ user, onBack }) {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequestHistory = async () => {
    try {
      setLoading(true);
      setError("");

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
          data.error || "Failed to load request history."
        );
      }

      const historyRequests = (data.complaints || []).filter(
        (complaint) =>
          complaint.status === "RESOLVED" ||
          complaint.status === "CLOSED"
      );

      setComplaints(historyRequests);
    } catch (error) {
      console.error(
        "Failed to load request history:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while loading request history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRequestHistory();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [user]);

  const handleRefresh = async () => {
    await loadRequestHistory();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "RESOLVED":
        return "status-resolved";

      case "CLOSED":
        return "status-closed";

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


          {/* Back */}

          <button
            type="button"
            className="detail-back-button"
            onClick={() =>
              setSelectedComplaint(null)
            }
          >
            ← Back to Request History
          </button>


          {/* Header */}

          <div className="detail-header">

            <div>

              <span className="detail-label">
                COMPLETED REQUEST
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


          {/* Information */}

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
                Completed
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


          {/* Resolution */}

          <div className="resolution-box">

            <h3>
              Resolution
            </h3>

            {complaint.resolutionNotes ? (
              <p>
                {complaint.resolutionNotes}
              </p>
            ) : (
              <p className="no-resolution">
                No resolution notes were provided.
              </p>
            )}

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

          {complaint.photoUrl && (
            <div className="photo-reference">

              <span>
                Issue Photo
              </span>

              <p>
                Photo attached to this maintenance
                request.
              </p>

            </div>
          )}

        </div>


        <div className="dashboard-decoration">

          <span>🍒</span>
          <span>🏠</span>
          <span>🍒</span>

        </div>

      </div>
    );
  }


  /* =====================================================
     HISTORY LIST
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


        {/* Heading */}

        <div className="dashboard-heading">

          <h2>
            Request History 📜
          </h2>

          <p>
            View your completed maintenance requests.
          </p>

        </div>


        {/* Loading */}

        {loading && (
          <div className="request-message">
            Loading your request history...
          </div>
        )}


        {/* Error */}

        {!loading && error && (
          <div className="auth-message">
            {error}
          </div>
        )}


        {/* Empty */}

        {!loading &&
          !error &&
          complaints.length === 0 && (

            <div className="empty-state">

              <div className="empty-state-icon">
                📜
              </div>

              <h3>
                No completed requests
              </h3>

              <p>
                Your resolved and closed maintenance
                requests will appear here.
              </p>

            </div>

          )}


        {/* History cards */}

        {!loading &&
          !error &&
          complaints.length > 0 && (

            <div className="complaints-list">

              {complaints.map((complaint) => (

                <div
                  className="complaint-card"
                  key={complaint.complaintId}
                >

                  {/* Header */}

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
                        Completed
                      </span>

                      <strong>
                        {formatDate(
                          complaint.updatedAt
                        )}
                      </strong>

                    </div>

                  </div>


                  {/* Footer */}

                  <div className="complaint-card-footer">

                    <span className="request-preview">

                      {complaint.resolutionNotes ||
                        "Maintenance request completed."}

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


        {/* Bottom buttons */}

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
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>

      </div>


      <div className="dashboard-decoration">

        <span>🍒</span>
        <span>🏠</span>
        <span>🍒</span>

      </div>

    </div>
  );
}

export default RequestHistory;