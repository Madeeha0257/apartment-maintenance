import WorkerAssignedRequests from "./WorkerAssignedRequests";

function WorkerInProgress({ user, onBack }) {
  return (
    <WorkerAssignedRequests
      user={user}
      onBack={onBack}
      statusFilter="IN PROGRESS"
      title="Requests In Progress"
      description="Maintenance requests currently being worked on."
    />
  );
}

export default WorkerInProgress;