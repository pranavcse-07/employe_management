import { useState } from "react";
import { useAuth } from "./context/AuthProvider.jsx";
import Login from "./components/Auth/Login.jsx";
import AdminDashboard from "./components/Dashboard/AdminDashboard.jsx";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard.jsx";

export default function App() {
  const { user } = useAuth();
  const [loginError, setLoginError] = useState("");

  if (!user) return <Login loginError={loginError} setLoginError={setLoginError} />;
  if (user.role === "admin") return <AdminDashboard />;
  return <EmployeeDashboard />;
}