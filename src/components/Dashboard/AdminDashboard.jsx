import { useMemo, useState } from "react";
import { Plus, Users, ClipboardList, Search } from "lucide-react";
import { useAuth } from "../../context/AuthProvider.jsx";
import TopBar from "./TopBar.jsx";
import StatCard from "./StatCard.jsx";
import TaskCard from "./TaskCard.jsx";

export default function AdminDashboard() {
  const { employees, createTask } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({ employeeId: "", taskTitle: "", taskDescription: "", taskDate: "", category: "" });
  const allTasks = employees.flatMap((employee) => employee.tasks.map((task) => ({ ...task, employeeName: employee.firstName, employeeId: employee.id })));
  const counts = useMemo(() => ({
    new: allTasks.filter((task) => task.status === "new").length,
    active: allTasks.filter((task) => task.status === "active").length,
    completed: allTasks.filter((task) => task.status === "completed").length,
    failed: allTasks.filter((task) => task.status === "failed").length
  }), [employees]);
  const visibleTasks = allTasks.filter((task) => {
    const matchesSearch = `${task.taskTitle} ${task.employeeName} ${task.category}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (filter === "all" || task.status === filter);
  });

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.employeeId) { setNotice("Please select an employee."); return; }
    createTask(form);
    setForm({ employeeId: "", taskTitle: "", taskDescription: "", taskDate: "", category: "" });
    setNotice("Task assigned successfully.");
    window.setTimeout(() => setNotice(""), 3000);
  }
  function updateForm(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  return (
    <div className="app-shell"><TopBar subtitle="Team overview" /><main className="dashboard-content">
      <section className="welcome-row"><div><p className="eyebrow">ADMIN DASHBOARD</p><h1>Team overview</h1><p className="muted">Manage your employees and keep every task moving.</p></div><div className="overview-chip"><Users size={18} /><span>{employees.length} team members</span></div></section>
      <section className="stats-grid">{["new", "active", "completed", "failed"].map((status) => <StatCard key={status} status={status} count={counts[status]} />)}</section>
      <div className="admin-layout">
        <section className="panel create-panel"><div className="panel-heading"><div><span className="panel-icon"><Plus size={18} /></span><h2>Assign a task</h2></div><span className="muted small-text">New assignment</span></div>
          <form className="task-form" onSubmit={handleSubmit}>
            <label>Task title<input name="taskTitle" value={form.taskTitle} onChange={updateForm} placeholder="e.g. Prepare monthly report" required /></label>
            <label>Assign to<select name="employeeId" value={form.employeeId} onChange={updateForm} required><option value="">Choose employee</option>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.firstName} — {employee.email}</option>)}</select></label>
            <div className="form-two"><label>Due date<input name="taskDate" type="date" value={form.taskDate} onChange={updateForm} required /></label><label>Category<input name="category" value={form.category} onChange={updateForm} placeholder="Design, Development..." required /></label></div>
            <label>Description<textarea name="taskDescription" value={form.taskDescription} onChange={updateForm} placeholder="Add task details..." rows="4" required /></label>
            {notice && <p className="success-message">{notice}</p>}
            <button className="button button-primary full-button" type="submit"><Plus size={17} /> Assign task</button>
          </form>
        </section>
        <section className="panel team-panel"><div className="panel-heading"><div><span className="panel-icon"><Users size={18} /></span><h2>Employees</h2></div><span className="count-badge">{employees.length}</span></div>
          <div className="employee-list">{employees.map((employee) => {
            const countsForEmployee = { new: 0, active: 0, completed: 0, failed: 0 };
            employee.tasks.forEach((task) => { countsForEmployee[task.status] += 1; });
            return <div className="employee-row" key={employee.id}><div className="avatar employee-avatar">{employee.firstName.slice(0, 1)}</div><div className="employee-info"><strong>{employee.firstName}</strong><span>{employee.email}</span></div><div className="employee-counts"><span title="New">{countsForEmployee.new}N</span><span title="In progress">{countsForEmployee.active}P</span><span title="Completed">{countsForEmployee.completed}C</span></div></div>;
          })}</div>
        </section>
      </div>
      <section className="panel tasks-panel"><div className="panel-heading task-panel-heading"><div><span className="panel-icon"><ClipboardList size={18} /></span><div><h2>All tasks</h2><p className="muted small-text">Track assignments across your team.</p></div></div><div className="task-tools"><div className="search-wrap"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks or employees" /></div><select aria-label="Filter tasks" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All statuses</option><option value="new">New</option><option value="active">In progress</option><option value="completed">Completed</option><option value="failed">Failed</option></select></div></div>
        {visibleTasks.length ? <div className="task-grid">{visibleTasks.map((task) => <div key={task.id}><div className="assigned-to">Assigned to <strong>{task.employeeName}</strong></div><TaskCard task={task} /></div>)}</div> : <div className="empty-state">No tasks match your search.</div>}
      </section>
    </main></div>
  );
}