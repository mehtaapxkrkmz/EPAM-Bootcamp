import { DragEvent, FormEvent, useMemo, useState } from "react";
import "./App.css";

type Status = "todo" | "inProgress" | "done";

type Task = {
  id: string;
  title: string;
  status: Status;
};

type Column = {
  key: Status;
  title: string;
};

const columns: Column[] = [
  { key: "todo", title: "To Do" },
  { key: "inProgress", title: "In Progress" },
  { key: "done", title: "Done" },
];

const initialTasks: Task[] = [
  { id: crypto.randomUUID(), title: "Create project structure", status: "todo" },
  { id: crypto.randomUUID(), title: "Build kanban board", status: "inProgress" },
  { id: crypto.randomUUID(), title: "Ship first version", status: "done" },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const groupedTasks = useMemo(
    () => ({
      todo: tasks.filter((task) => task.status === "todo"),
      inProgress: tasks.filter((task) => task.status === "inProgress"),
      done: tasks.filter((task) => task.status === "done"),
    }),
    [tasks]
  );

  const addTask = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = newTaskTitle.trim();
    if (!trimmed) {
      return;
    }

    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        title: trimmed,
        status: "todo",
      },
      ...prev,
    ]);
    setNewTaskTitle("");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const moveTask = (id: string, nextStatus: Status) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: nextStatus } : task))
    );
  };

  const onDragStart = (event: DragEvent<HTMLElement>, taskId: string) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/task-id", taskId);
  };

  const onDrop = (event: DragEvent<HTMLElement>, status: Status) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/task-id");
    if (!taskId) {
      return;
    }

    moveTask(taskId, status);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Task Board</h1>
        <p>Move tasks between To Do, In Progress, and Done.</p>
      </header>

      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(event) => setNewTaskTitle(event.target.value)}
          placeholder="Add a new task"
          aria-label="New task title"
        />
        <button type="submit">Add Task</button>
      </form>

      <main className="board-grid">
        {columns.map((column) => (
          <section
            key={column.key}
            className="board-column"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => onDrop(event, column.key)}
          >
            <div className="column-head">
              <h2>{column.title}</h2>
              <span>{groupedTasks[column.key].length}</span>
            </div>

            <div className="column-body">
              {groupedTasks[column.key].map((task) => (
                <article
                  key={task.id}
                  className="task-card"
                  draggable
                  onDragStart={(event) => onDragStart(event, task.id)}
                >
                  <p>{task.title}</p>
                  <div className="task-actions">
                    {column.key !== "todo" && (
                      <button type="button" onClick={() => moveTask(task.id, "todo")}>
                        To Do
                      </button>
                    )}
                    {column.key !== "inProgress" && (
                      <button type="button" onClick={() => moveTask(task.id, "inProgress")}>
                        In Progress
                      </button>
                    )}
                    {column.key !== "done" && (
                      <button type="button" onClick={() => moveTask(task.id, "done")}>
                        Done
                      </button>
                    )}
                    <button
                      type="button"
                      className="danger"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

export default App;
