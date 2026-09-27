import { useState } from "react";

const API_URL =
  "https://w7ngdx1tbg.execute-api.ap-south-1.amazonaws.com/dev";

function ComplaintForm({ user, onBack }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");

  const [photo, setPhoto] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          residentId: user?.userId || user?.username,
          residentEmail: user?.username || "",
          title,
          description,
          category,
          priority,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit complaint.");
      }

      setMessage(
        `Complaint submitted successfully! Complaint ID: ${data.complaint.complaintId}`
      );

      setTitle("");
      setDescription("");
      setCategory("");
      setPriority("");
      setPhoto(null);

      document.getElementById("complaint-photo").value = "";
    } catch (error) {
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-card complaint-form-card">

        <div className="brand">
          <div className="brand-icon">🏢</div>

          <div>
            <h1>CherryHomes</h1>
            <p>Resident Portal</p>
          </div>
        </div>

        <div className="dashboard-heading">
          <h2>Submit Maintenance Request 🛠️</h2>

          <p>
            Tell us what needs to be fixed in your apartment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="complaint-form">

          <div className="form-group">
            <label htmlFor="complaint-title">
              Complaint Title
            </label>

            <input
              id="complaint-title"
              type="text"
              placeholder="e.g. Water leakage in bathroom"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="complaint-description">
              Description
            </label>

            <textarea
              id="complaint-description"
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows="5"
              required
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="complaint-category">
                Category
              </label>

              <select
                id="complaint-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
              >
                <option value="">Select category</option>
                <option value="PLUMBING">Plumbing</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="CARPENTRY">Carpentry</option>
                <option value="CLEANING">Cleaning</option>
                <option value="APPLIANCE">Appliance</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="complaint-priority">
                Priority
              </label>

              <select
                id="complaint-priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                required
              >
                <option value="">Select priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

          </div>

          <div className="form-group">
            <label htmlFor="complaint-photo">
              Issue Photo
            </label>

            <input
              id="complaint-photo"
              type="file"
              accept="image/*"
              onChange={(event) => setPhoto(event.target.files[0])}
            />

            {photo && (
              <p className="file-name">
                Selected: {photo.name}
              </p>
            )}

            <small>
              Photo upload will be connected to secure AWS S3 storage next.
            </small>
          </div>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {error && (
            <div className="auth-message">
              {error}
            </div>
          )}

          <div className="form-buttons">

            <button
              type="button"
              className="logout-button"
              onClick={onBack}
              disabled={loading}
            >
              Back
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Request"}
            </button>

          </div>

        </form>

      </div>

      <div className="dashboard-decoration">
        <span>🍒</span>
        <span>🏠</span>
        <span>🍒</span>
      </div>
    </div>
  );
}

export default ComplaintForm;