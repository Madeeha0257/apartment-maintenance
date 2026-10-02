import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const API_URL =
  "https://w7ngdx1tbg.execute-api.ap-south-1.amazonaws.com/dev";

function AdminAnalytics({ onBack }) {
  const [statusData, setStatusData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [workerData, setWorkerData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);

      /* ================================
         Load Complaints
         ================================ */

      const complaintsResponse = await fetch(
        `${API_URL}/complaints`
      );

      const complaintsData =
        await complaintsResponse.json();

      if (!complaintsResponse.ok) {
        throw new Error(
          complaintsData.error ||
            "Failed to load complaints data."
        );
      }

      const complaints =
        complaintsData.complaints || [];

      /* ================================
         Load Workers
         ================================ */

      const workersResponse = await fetch(
        `${API_URL}/workers`
      );

      const workersData =
        await workersResponse.json();

      if (!workersResponse.ok) {
        throw new Error(
          workersData.error ||
            "Failed to load worker data."
        );
      }

      const workers =
        workersData.workers || [];

      /* ================================
         Complaints by Status
         ================================ */

      const statuses = [
        "REPORTED",
        "ASSIGNED",
        "IN PROGRESS",
        "RESOLVED",
        "CLOSED",
      ];

      const statusChartData = statuses.map(
        (status) => ({
          status,
          count: complaints.filter(
            (complaint) =>
              complaint.status === status
          ).length,
        })
      );

      setStatusData(statusChartData);

      /* ================================
         Complaints by Category
         ================================ */

      const categories = [
        "PLUMBING",
        "ELECTRICAL",
        "CARPENTRY",
        "CLEANING",
        "APPLIANCE",
        "OTHER",
      ];

      const categoryChartData =
        categories.map((category) => ({
          category,
          count: complaints.filter(
            (complaint) =>
              complaint.category === category
          ).length,
        }));

      setCategoryData(categoryChartData);

      /* ================================
         Complaints by Priority
         ================================ */

      const priorities = [
        "LOW",
        "MEDIUM",
        "HIGH",
        "URGENT",
      ];

      const priorityChartData =
        priorities.map((priority) => ({
          priority,
          count: complaints.filter(
            (complaint) =>
              complaint.priority === priority
          ).length,
        }));

      setPriorityData(priorityChartData);

      /* ================================
         Worker Performance Analytics
         ================================ */

      const workerChartData = workers.map(
        (worker) => {
          const workerComplaints =
            complaints.filter(
              (complaint) =>
                complaint.assignedWorkerId ===
                worker.workerId
            );

          return {
            worker: worker.workerId,

            assigned:
              workerComplaints.length,

            inProgress:
              workerComplaints.filter(
                (complaint) =>
                  complaint.status ===
                  "IN PROGRESS"
              ).length,

            completed:
              workerComplaints.filter(
                (complaint) =>
                  complaint.status ===
                    "RESOLVED" ||
                  complaint.status ===
                    "CLOSED"
              ).length,
          };
        }
      );

      setWorkerData(workerChartData);
    } catch (error) {
      console.error(
        "Failed to load analytics:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAnalytics();
  }, [loadAnalytics]);

  return (
    <div className="analytics-page">
      <div className="analytics-card">

        {/* ================================
            Brand
            ================================ */}

        <div className="brand">
          <div className="brand-icon">
            🏢
          </div>

          <div>
            <h1>CherryHomes</h1>
            <p>Admin Portal</p>
          </div>
        </div>

        {/* ================================
            Back Button
            ================================ */}

        <button
          type="button"
          className="analytics-back"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        {/* ================================
            Page Heading
            ================================ */}

        <div className="analytics-heading">
          <h2>
            Maintenance Analytics 📊
          </h2>

          <p>
            Overview of apartment maintenance
            requests.
          </p>
        </div>

        {/* ================================
            Top Analytics Row
            ================================ */}

        <div className="analytics-top-grid">

          {/* Status Chart */}

          <div className="analytics-section">
            <div className="analytics-section-heading">
              <h3>
                Complaints by Status
              </h3>

              <p>
                Distribution of maintenance
                requests across their current
                status.
              </p>
            </div>

            <div className="analytics-chart analytics-chart-compact">
              {loading ? (
                <div className="analytics-loading">
                  Loading analytics...
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <BarChart
                    data={statusData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -10,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="status"
                      tick={{
                        fontSize: 10,
                      }}
                      interval={0}
                    />

                    <YAxis
                      allowDecimals={false}
                      tick={{
                        fontSize: 11,
                      }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="count"
                      name="Complaints"
                      fill="#c72c48"
                      radius={[
                        6,
                        6,
                        0,
                        0,
                      ]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Priority Chart */}

          <div className="analytics-section">
            <div className="analytics-section-heading">
              <h3>
                Complaints by Priority
              </h3>

              <p>
                Distribution of maintenance
                requests by priority level.
              </p>
            </div>

            <div className="analytics-pie-chart analytics-chart-compact">
              {loading ? (
                <div className="analytics-loading">
                  Loading analytics...
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <PieChart>
                    <Pie
                      data={priorityData}
                      dataKey="count"
                      nameKey="priority"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={50}
                      paddingAngle={3}
                      label
                    >
                      {priorityData.map(
                        (entry) => (
                          <Cell
                            key={
                              entry.priority
                            }
                            fill={
                              entry.priority ===
                              "LOW"
                                ? "#8fc98f"
                                : entry.priority ===
                                  "MEDIUM"
                                ? "#f0c75e"
                                : entry.priority ===
                                  "HIGH"
                                ? "#e88a5b"
                                : "#c72c48"
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </div>

        {/* ================================
            Category Chart
            ================================ */}

        <div className="analytics-section">
          <div className="analytics-section-heading">
            <h3>
              Complaints by Category
            </h3>

            <p>
              Distribution of maintenance
              requests by complaint category.
            </p>
          </div>

          <div className="analytics-chart analytics-chart-wide">
            {loading ? (
              <div className="analytics-loading">
                Loading analytics...
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{
                    top: 10,
                    right: 30,
                    left: 20,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="category"
                    width={90}
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="count"
                    name="Complaints"
                    fill="#c72c48"
                    radius={[
                      0,
                      6,
                      6,
                      0,
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ================================
            Worker Performance
            ================================ */}

        <div className="analytics-section">
          <div className="analytics-section-heading">
            <h3>
              Worker Performance
            </h3>

            <p>
              Overview of assigned, in-progress,
              and completed requests for each
              worker.
            </p>
          </div>

          <div className="analytics-worker-chart">
            {loading ? (
              <div className="analytics-loading">
                Loading worker analytics...
              </div>
            ) : workerData.length === 0 ? (
              <div className="analytics-loading">
                No workers available.
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <BarChart
                  data={workerData}
                  layout="vertical"
                  margin={{
                    top: 10,
                    right: 30,
                    left: 20,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="worker"
                    width={100}
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="assigned"
                    name="Assigned"
                    fill="#c72c48"
                    radius={[
                      0,
                      5,
                      5,
                      0,
                    ]}
                  />

                  <Bar
                    dataKey="inProgress"
                    name="In Progress"
                    fill="#e88a5b"
                    radius={[
                      0,
                      5,
                      5,
                      0,
                    ]}
                  />

                  <Bar
                    dataKey="completed"
                    name="Completed"
                    fill="#8fc98f"
                    radius={[
                      0,
                      5,
                      5,
                      0,
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Decorative Footer */}
      <div className="dashboard-decoration">
        <span>🍒</span>
        <span>📊</span>
        <span>🍒</span>
      </div>
    </div>
  );
}

export default AdminAnalytics;