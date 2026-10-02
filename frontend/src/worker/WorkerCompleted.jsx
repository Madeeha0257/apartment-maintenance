import WorkerAssignedRequests from "./WorkerAssignedRequests";

function WorkerCompleted({ user, onBack }) {
  return (
    <WorkerAssignedRequests
      user={user}
      onBack={onBack}
      statusFilter={["RESOLVED", "CLOSED"]}
      title="Completed Requests"
      description="Maintenance requests that have been resolved or closed."
    />
  );
}

export default WorkerCompleted;