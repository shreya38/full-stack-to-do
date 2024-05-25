import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Fetch tasks from the server
  useEffect(() => {
    setLoadingTable(true);
    setLoadingMessage("Loading tasks...");
    axios
      .get("http://localhost:4001/tasks")
      .then((response) => {
        setTasks(response.data);
        setLoadingTable(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks: ", error);
        setLoadingTable(false);
      });
  }, []);

  const createTask = () => {
    if (title && description && status && dueDate) {
      setLoadingForm(true);
      setLoadingMessage("Creating task...");
      axios
        .post("http://localhost:4001/tasks", {
          title,
          description,
          status,
          dueDate,
        })
        .then((response) => {
          setTasks((prevTasks) => [...prevTasks, response.data]);
          clearForm();
          setLoadingForm(false);
        })
        .catch((error) => {
          console.error("Error creating task: ", error);
          setLoadingForm(false);
        });
    } else {
      checkField(title, description, status, dueDate);
    }
  };

  function checkField(title, description, status, dueDate) {
    if (!title) {
      alert("No data in title");
    } else if (!description) {
      alert("No data in description");
    } else if (!status) {
      alert("No data in status");
    } else if (!dueDate) {
      alert("No data in due date");
    }
  }

  const updateTask = () => {
    setLoadingForm(true);
    setLoadingMessage("Updating task...");
    axios
      .put(`http://localhost:4001/tasks/${id}`, {
        title,
        description,
        status,
        dueDate,
      })
      .then((response) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === id ? response.data : task))
        );
        clearForm();
        setLoadingForm(false);
      })
      .catch((error) => {
        console.error("Error updating task: ", error);
        setLoadingForm(false);
      });
  };

  const deleteTask = (taskId) => {
    setLoadingTable(true);
    setLoadingMessage("Deleting task...");
    axios
      .delete(`http://localhost:4001/tasks/${taskId}`)
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        setLoadingTable(false);
      })
      .catch((error) => {
        console.error("Error deleting task: ", error);
        setLoadingTable(false);
      });
  };

  const clearForm = () => {
    setId("");
    setTitle("");
    setDescription("");
    setStatus("");
    setDueDate("");
  };

  const handleEditClick = (task) => {
    setId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setDueDate(task.dueDate);
  };

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center">
      <h1><strong><u>Todo List</u></strong></h1>
      <div className="container">
        {loadingTable ? (
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>{loadingMessage}</p>
          </div>
        ) : (
          <table className="table m-0 p-5">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Status</th>
                <th scope="col">Due Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task.id}>
                    <th scope="row">{task.id}</th>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>
                      {task.status === "Completed" ? (
                        <button className="btn bg-success-subtle border border-success-subtle">
                          {task.status}
                        </button>
                      ) : task.status === "In-progress" ? (
                        <button className="btn bg-warning-subtle border border-warning-subtle">
                          {task.status}
                        </button>
                      ) : task.status === "Pending" ? (
                        <button className="btn bg-info-subtle border border-primary-subtle">{task.status}</button>
                      ) : (
                        " "
                      )}
                    </td>
                    <td>{task.dueDate}</td>
                    <td>
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => handleEditClick(task)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger mx-2"
                        onClick={() => deleteTask(task.id)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6"></td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="container mt-3 p-5 border border-5 rounded">
        {loadingForm && (
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>{loadingMessage}</p>
          </div>
        )}
        {!loadingForm && (
          <>
            {id && (
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingId"
                  value={id}
                  disabled
                />
                <label htmlFor="floatingId">ID</label>
              </div>
            )}
            <div className="row">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingTitle"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
                <label htmlFor="floatingTitle"><strong>Title</strong></label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingDescription"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
                <label htmlFor="floatingDescription"><strong>Description</strong></label>
              </div>
              <div className="form-floating mb-3">
                <select
                  id="floatingStatus"
                  className="form-select"
                  onChange={(e) => setStatus(e.target.value)}
                  value={status}
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In-progress">In-progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <label htmlFor="floatingStatus"><strong>Status</strong></label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="date"
                  className="form-control"
                  id="floatingDate"
                  onChange={(e) => setDueDate(e.target.value)}
                  value={dueDate}
                />
                <label htmlFor="floatingDate"><strong> Due Date</strong></label>
              </div>
            </div>
            <div className="row my-5 d-flex justify-content-center align-items-center">
              <button
                className="btn btn-outline-primary w-25 mx-2"
                onClick={updateTask}
                disabled={!id}
              >
                <strong>Update</strong>
              </button>
              <button
                className="btn btn-outline-success w-25 mx-2"
                onClick={createTask}
                disabled={id}
              >
               <strong>Create Task</strong>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
