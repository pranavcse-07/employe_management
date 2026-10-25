import { useMemo, useState } from "react";
import { ClipboardList, Search } from "lucide-react";
import { useAuth } from "../../context/AuthProvider.jsx";
import TopBar from "./TopBar.jsx";
import StatCard from "./StatCard.jsx";
import TaskCard from "./TaskCard.jsx";

export default function EmployeeDashboard() {
  const { user, employees, updateTaskStatus } = useAuth();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const employee = employees.find((item) => item.id === user.id);
  const tasks = employee?.tasks ?? [];
  const counts = useMemo(() => ({
    new: tasks.filter((task) => task.status === "new").length,
    active: tasks.filter((task) => task.status === "active").length,
    completed: tasks.filter((task) => task.status === "completed").length,
    failed: tasks.filter((task) => task.status === "failed").length
  }), [tasks]);
  const visibleTasks = tasks.filter((task) =>
    (filter === "all" || task.status === filter) &&
    `${task.taskTitle} ${task.category} ${task.taskDescription}`.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="app-shell"><TopBar subtitle="My workspace" /><main className="dashboard-content">
      <section className="welcome-row"><div><p className="eyebrow">EMPLOYEE DASHBOARD</p><h1>Hello, {employee?.firstName || user.name} 👋</h1><p className="muted">Here is your task progress. Keep up the great work.</p></div><div className="overview-chip"><ClipboardList size={18} /><span>{tasks.length} total tasks</span></div></section>
      <section className="stats-grid">{["new", "active", "completed", "failed"].map((status) => <StatCard key={status} status={status} count={counts[status]} />)}</section>
      <section className="panel tasks-panel"><div className="panel-heading task-panel-heading"><div><span className="panel-icon"><ClipboardList size={18} /></span><div><h2>My tasks</h2><p className="muted small-text">Accept new tasks and update their progress.</p></div></div><div className="task-tools"><div className="search-wrap"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search my tasks" /></div><select aria-label="Filter tasks" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All statuses</option><option value="new">New</option><option value="active">In progress</option><option value="completed">Completed</option><option value="failed">Failed</option></select></div></div>
        {visibleTasks.length ? <div className="task-grid">{visibleTasks.map((task) => <TaskCard key={task.id} task={task} employeeMode employeeId={employee.id} onStatusChange={updateTaskStatus} />)}</div> : <div className="empty-state">No tasks here yet. Try a different filter.</div>}
      </section>
    </main></div>
  );
}