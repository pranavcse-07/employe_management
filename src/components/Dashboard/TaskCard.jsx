import { CalendarDays, Check, CircleX, Play } from "lucide-react";

const statusLabels = { new: "New", active: "In progress", completed: "Completed", failed: "Failed" };

export default function TaskCard({ task, employeeMode, onStatusChange, employeeId }) {
  return (
    <article className="task-card">
      <div className="task-card-top"><span className={`category-tag ${task.status}`}>{task.category || "General"}</span><span className={`status-tag ${task.status}`}>{statusLabels[task.status]}</span></div>
      <h3>{task.taskTitle}</h3>
      <p className="task-description">{task.taskDescription || "No description provided."}</p>
      <div className="task-date"><CalendarDays size={15} /><span>{task.taskDate ? new Date(`${task.taskDate}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "No due date"}</span></div>
      {employeeMode && task.status !== "completed" && task.status !== "failed" && (
        <div className="task-actions">
          {task.status === "new" && <button className="button button-small button-primary" onClick={() => onStatusChange(employeeId, task.id, "active")}><Play size={14} /> Accept task</button>}
          {task.status === "active" && <button className="button button-small button-success" onClick={() => onStatusChange(employeeId, task.id, "completed")}><Check size={14} /> Mark complete</button>}
          {task.status === "active" && <button className="button button-small button-danger-outline" onClick={() => onStatusChange(employeeId, task.id, "failed")}><CircleX size={14} /> Mark failed</button>}
        </div>
      )}
    </article>
  );
}