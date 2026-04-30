import React, { useEffect, useState } from "react";
import api from "../api/axious";
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/projects");
      setProjects(res.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Failed to fetch projects. Please try again."
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setCreateError("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    try {
      const res = await api.post("/projects", {
        name: form.name,
        description: form.description,
      });
      setForm({ name: "", description: "" });
      // Option 1: refetch
      await fetchProjects();
      // Option 2: Optimistic update:
      // setProjects(prev => [...prev, res.data]);
    } catch (err) {
      setCreateError(
        err?.response?.data?.detail || "Failed to create project. Please try again."
      );
    }
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-center">Projects</h1>
        <div className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
          {createError && (
            <div className="mb-3 text-sm text-red-500">{createError}</div>
          )}
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label
                className="block text-gray-700 mb-1 font-medium"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                className="block text-gray-700 mb-1 font-medium"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition disabled:opacity-70"
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Project"}
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : projects.length === 0 ? (
            <div>No projects found.</div>
          ) : (
            <div className="grid gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded shadow p-5"
                >
                  <h3 className="text-lg font-bold">{project.name}</h3>
                  {project.description && (
                    <p className="text-gray-700 mt-2">{project.description}</p>
                  )}
                  {/* Add more project fields as needed */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;