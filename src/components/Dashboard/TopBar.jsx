import { LogOut, BriefcaseBusiness } from "lucide-react";
import { useAuth } from "../../context/AuthProvider.jsx";

export default function TopBar({ subtitle }) {
  const { user, logout } = useAuth();
  return (
    <header className="topbar">
      <div className="topbar-brand"><div className="small-brand"><BriefcaseBusiness size={20} /></div><div><strong>WorkSpace</strong><span>{subtitle}</span></div></div>
      <div className="topbar-user"><div className="avatar">{(user?.name || "U").slice(0, 1).toUpperCase()}</div><div className="user-label"><strong>{user?.name}</strong><span>{user?.role === "admin" ? "Administrator" : "Employee"}</span></div><button className="button button-quiet logout-button" onClick={logout}><LogOut size={16} /><span>Log out</span></button></div>
    </header>
  );
}