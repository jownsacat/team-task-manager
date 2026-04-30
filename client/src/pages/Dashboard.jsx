import React, { useEffect, useState } from "react";
import api from "../api/axious";
const statCardConfig = [
  { key: "total_tasks", label: "Total Tasks", color: "bg-blue-600" },
  { key: "todo", label: "To Do", color: "bg-yellow-500" },
  { key: "in_progress", label: "In Progress", color: "bg-purple-500" },
  { key: "done", label: "Done", color: "bg-green-600" },
  { key: "overdue", label: "Overdue", color: "bg-red-600" },
];

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/dashboard");
        setStats(res.data || {});
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
            "Failed to fetch dashboard data. Please try again."
        );
      }
      setLoading(false);
    };

    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Dashboard</h1>
        {loading ? (
          <div className="text-center text-lg">Loading dashboard...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {statCardConfig.map((card) => (
              <div
                key={card.key}
                className={`rounded-lg shadow p-6 flex flex-col items-center ${card.color} text-white`}
              >
                <div className="text-xl font-semibold mb-2">{card.label}</div>
                <div className="text-4xl font-bold">
                  {stats[card.key] !== undefined ? stats[card.key] : 0}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;