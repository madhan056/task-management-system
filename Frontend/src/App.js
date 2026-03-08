import React, { useEffect, useState } from "react";
import "./App.css";
import CustomDropdown from "./CustomDropdown";

function App() {
  const API_URL = "http://127.0.0.1:8000/api/tasks/";

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [statusFilter, setStatusFilter] = useState("All");

  // NEW SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("");

  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [editingId, setEditingId] = useState(null);

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
    { label: "Overdue", value: "overdue" },
  ];

  const priorityOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ];

  const filterOptions = [
    { label: "All Tasks", value: "All" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
    { label: "Overdue", value: "overdue" },
  ];

  const fetchTasks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  // CREATE
  const createTask = async () => {
  if (!title.trim() || !taskDate || !taskTime) {
    setError("Title, Date and Time are required!");
    return;
  }

  setError("");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title.trim(),
      description,
      task_date: taskDate,
      task_time: taskTime,
      status,
      priority,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    setError(data.title ? data.title[0] : "Failed to create task");
    return;
  }

  setTitle("");
  setDescription("");
  setTaskDate("");
  setTaskTime("");
  setStatus("pending");
  setPriority("medium");

  fetchTasks();
};

  // DELETE
  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?"))
      return;

    await fetch(`${API_URL}${id}/`, { method: "DELETE" });
    fetchTasks();
  };

  // OPEN EDIT
  const openEditModal = (task) => {
    if (task.status === "completed") {
      alert("Completed tasks cannot be edited.");
      return;
    }

    setEditingId(task.id);
    setEditData(task);
    setShowModal(true);
  };

  // SAVE EDIT
  const saveEdit = async (e) => {
    e.preventDefault();

    if (!window.confirm("Are you sure you want to update this task?"))
      return;

    const today = new Date().toISOString().split("T")[0];
    let updatedStatus = editData.status;

    if (editData.status !== "completed" && editData.task_date < today) {
      updatedStatus = "overdue";
    }

    await fetch(`${API_URL}${editingId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editData.title,
        description: editData.description,
        task_date: editData.task_date,
        task_time: editData.task_time,
        status: updatedStatus,
        priority: editData.priority,
      }),
    });

    setShowModal(false);
    fetchTasks();
  };

  // ✅ UPDATED FILTER LOGIC (Search + Status)
  const filteredTasks = tasks
    .filter((task) =>
      statusFilter === "All" ? true : task.status === statusFilter
    )
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // ✅ STATISTICS
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const pendingTasks = tasks.filter(t => t.status === "pending").length;
  const overdueTasks = tasks.filter(t => t.status === "overdue").length;

  return (
    <div className="container">
      <div className="header">
        <div className="logo-circle">🗂</div>
        <h1>
          Task <span>Management System</span>
        </h1>
      </div>

      {/* CREATE SECTION */}
      <div className="form-wrapper">
        <div className="form-row">
          <input
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
          />
          <input
            type="time"
            value={taskTime}
            onChange={(e) => setTaskTime(e.target.value)}
          />
          <input
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <CustomDropdown
            options={statusOptions}
            selected={status}
            onChange={setStatus}
          />
          <CustomDropdown
            options={priorityOptions}
            selected={priority}
            onChange={setPriority}
          />
        </div>

        <div className="add-btn-wrapper">
          <button className="add-btn" onClick={createTask}>
            Add Task
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* ✅ SEARCH */}
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="🔍 Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* FILTER */}
      <div className="filter-wrapper">
        <label>Status Filter</label>
        <div className="filter-center">
          <CustomDropdown
            options={filterOptions}
            selected={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      {/* ✅ STATISTICS */}
      <div className="stats-wrapper">
        <div className="stat-card total">
          <h3>Total</h3>
          <p>{totalTasks}</p>
        </div>
        <div className="stat-card pending">
          <h3>Pending</h3>
          <p>{pendingTasks}</p>
        </div>
        <div className="stat-card completed">
          <h3>Completed</h3>
          <p>{completedTasks}</p>
        </div>
        <div className="stat-card overdue">
          <h3>Overdue</h3>
          <p>{overdueTasks}</p>
        </div>
      </div>

      {/* TASK GRID */}
      <div className="messages-grid">
        {filteredTasks.map((task) => (
          <div
            className={`message-card ${task.priority} ${task.status}`}
            key={task.id}
          >
            <div className="top-row">
              <h3 className="task-title">
  {task.title && task.title.trim() !== ""
    ? task.title
    : "Untitled Task"}
</h3>
            </div>

            <p>{task.description}</p>
            <p>📅 {task.task_date}</p>
            <p>⏰ {task.task_time}</p>

            <div className="card-buttons">
              <button
                type="button"
                className="edit-btn"
                onClick={() => openEditModal(task)}
              >
                ✏ Edit
              </button>

              <button
                type="button"
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL (UNCHANGED) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Task</h2>
            <form onSubmit={saveEdit}>
              <input
                type="text"
                value={editData.title || ""}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />
              <textarea
                value={editData.description || ""}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              />
              <div className="modal-row">
                <input
                  type="date"
                  value={editData.task_date || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, task_date: e.target.value })
                  }
                />
                <input
                  type="time"
                  value={editData.task_time || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, task_time: e.target.value })
                  }
                />
              </div>
              <div className="modal-row">
                <select
                  value={editData.status || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, status: e.target.value })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
                <select
                  value={editData.priority || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, priority: e.target.value })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="modal-buttons">
                <button type="submit">Update</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;