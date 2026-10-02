const STATUS_STEPS = [
  {
    key: "REPORTED",
    label: "Reported",
  },
  {
    key: "ASSIGNED",
    label: "Assigned",
  },
  {
    key: "IN PROGRESS",
    label: "In Progress",
  },
  {
    key: "RESOLVED",
    label: "Resolved",
  },
  {
    key: "CLOSED",
    label: "Closed",
  },
];

function StatusTimeline({ status }) {
  const currentIndex = STATUS_STEPS.findIndex(
    (step) => step.key === status
  );

  return (
    <div className="status-timeline">

      {STATUS_STEPS.map((step, index) => {

        const isCompleted =
          currentIndex >= 0 && index < currentIndex;

        const isCurrent =
          currentIndex === index;

        const isUpcoming =
          currentIndex >= 0 && index > currentIndex;

        return (
          <div
            className="timeline-step-wrapper"
            key={step.key}
          >

            <div className="timeline-step">

              <div
                className={`timeline-circle ${
                  isCompleted
                    ? "completed"
                    : isCurrent
                    ? "current"
                    : isUpcoming
                    ? "upcoming"
                    : ""
                }`}
              >
                {isCompleted ? "✓" : index + 1}
              </div>

              <span
                className={`timeline-label ${
                  isCurrent
                    ? "current-label"
                    : ""
                }`}
              >
                {step.label}
              </span>

            </div>


            {index < STATUS_STEPS.length - 1 && (
              <div
                className={`timeline-line ${
                  isCompleted
                    ? "completed-line"
                    : ""
                }`}
              />
            )}

          </div>
        );
      })}

    </div>
  );
}

export default StatusTimeline;