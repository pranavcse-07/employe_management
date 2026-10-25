import { CheckCircle2, CircleDashed, Clock3, XCircle } from "lucide-react";

const icons = { new: CircleDashed, active: Clock3, completed: CheckCircle2, failed: XCircle };
const labels = { new: "New tasks", active: "In progress", completed: "Completed", failed: "Failed" };

export default function StatCard({ status, count }) {
  const Icon = icons[status];
  return <article className={`stat-card stat-${status}`}><div className="stat-top"><span>{labels[status]}</span><Icon size={20} /></div><strong>{count}</strong><span className="stat-caption">Tasks assigned</span></article>;
}