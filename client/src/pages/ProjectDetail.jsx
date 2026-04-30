import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axious";
const STATUS_OPTIONS = [
  "todo",
  "in_progress",
  "done"
];

const statusLabels = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done"
};

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/tasks", {
        params: { project_id: projectId }
      });
      setTasks(res.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Failed to fetch tasks. Please try again."
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [projectId]);

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingTaskId(taskId);
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks =>
        tasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
        "Failed to update task status. Please try again."
      );
    }
    setUpdatingTaskId(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Project Tasks</h1>
      {loading ? (
        <div>Loading tasks...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : tasks.length === 0 ? (
        <div>No tasks found for this project.</div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div
              key={task.id}
              className="p-4 border rounded flex items-center justify-between bg-gray-50"
            >
              <div>
                <div className="font-medium">{task.name}</div>
                <div className="text-gray-600 text-sm">{task.description}</div>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  className="border rounded px-2 py-1 focus:outline-none"
                  value={task.status}
                  disabled={updatingTaskId === task.id}
                  onChange={e =>
                    handleStatusChange(task.id, e.target.value)
                  }
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
                {updatingTaskId === task.id && (
                  <span className="text-xs ml-1 text-blue-500">Updating...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;