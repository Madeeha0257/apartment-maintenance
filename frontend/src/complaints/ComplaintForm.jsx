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

  // --------------------------------------------------
  // Convert selected image to Base64
  // --------------------------------------------------

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;

        // FileReader returns:
        // data:image/jpeg;base64,XXXXXXXX
        //
        // Lambda only needs the actual Base64 part.
        const base64Data = result.split(",")[1];

        resolve(base64Data);
      };

      reader.onerror = () => {
        reject(new Error("Could not read the selected image."));
      };

      reader.readAsDataURL(file);
    });
  };

  // --------------------------------------------------
  // Photo selection
  // --------------------------------------------------

  const handlePhotoChange = (event) => {
    const selectedFile = event.target.files[0];

    setError("");
    setMessage("");

    if (!selectedFile) {
      setPhoto(null);
      return;
    }

    // Check file type
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file.");
      event.target.value = "";
      setPhoto(null);
      return;
    }

    // Maximum 5 MB
    const maxSize = 5 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setError("Photo size must be 5 MB or less.");
      event.target.value = "";
      setPhoto(null);
      return;
    }

    setPhoto(selectedFile);
  };

  // --------------------------------------------------
  // Submit complaint
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      let photoData = null;

      // Convert photo to Base64 only if one was selected
      if (photo) {
        photoData = await convertToBase64(photo);
      }

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

          // Photo information
          photoData,
          photoName: photo?.name || "",
          photoType: photo?.type || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to submit complaint."
        );
      }

      setMessage(
        `Complaint submitted successfully! Complaint ID: ${data.complaint.complaintId}`
      );

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setPriority("");
      setPhoto(null);

      const photoInput =
        document.getElementById("complaint-photo");

      if (photoInput) {
        photoInput.value = "";
      }

    } catch (error) {
      console.error("Complaint submission error:", error);

      setError(
        error.message || "Something went wrong."
      );
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

        <form
          onSubmit={handleSubmit}
          className="complaint-form"
        >

          {/* Complaint Title */}

          <div className="form-group">
            <label htmlFor="complaint-title">
              Complaint Title
            </label>

            <input
              id="complaint-title"
              type="text"
              placeholder="e.g. Water leakage in bathroom"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
            />
          </div>


          {/* Description */}

          <div className="form-group">
            <label htmlFor="complaint-description">
              Description
            </label>

            <textarea
              id="complaint-description"
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows="5"
              required
            />
          </div>


          {/* Category + Priority */}

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="complaint-category">
                Category
              </label>

              <select
                id="complaint-category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                required
              >
                <option value="">
                  Select category
                </option>

                <option value="PLUMBING">
                  Plumbing
                </option>

                <option value="ELECTRICAL">
                  Electrical
                </option>

                <option value="CARPENTRY">
                  Carpentry
                </option>

                <option value="CLEANING">
                  Cleaning
                </option>

                <option value="APPLIANCE">
                  Appliance
                </option>

                <option value="OTHER">
                  Other
                </option>
              </select>
            </div>


            <div className="form-group">
              <label htmlFor="complaint-priority">
                Priority
              </label>

              <select
                id="complaint-priority"
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value)
                }
                required
              >
                <option value="">
                  Select priority
                </option>

                <option value="LOW">
                  Low
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HIGH">
                  High
                </option>

                <option value="URGENT">
                  Urgent
                </option>
              </select>
            </div>

          </div>


          {/* Photo */}

          <div className="form-group">

            <label htmlFor="complaint-photo">
              Issue Photo
            </label>

            <input
              id="complaint-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />

            {photo && (
              <p className="file-name">
                Selected: {photo.name}
              </p>
            )}

            <small>
              Optional. Upload an image of the maintenance
              issue. Maximum size: 5 MB.
            </small>

          </div>


          {/* Success */}

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}


          {/* Error */}

          {error && (
            <div className="auth-message">
              {error}
            </div>
          )}


          {/* Buttons */}

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