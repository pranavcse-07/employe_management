import { createContext, useContext, useEffect, useState } from "react";
import { initialEmployees } from "../data/intialData.jsx";

const AuthContext = createContext(null);
const EMPLOYEES_KEY = "ems_employees_v1";
const SESSION_KEY = "ems_session_v1";

export function AuthProvider({ children }) {
  const [employees, setEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem(EMPLOYEES_KEY);
      return saved ? JSON.parse(saved) : initialEmployees;
    } catch {
      return initialEmployees;
    }
  });
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  function login(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === "admin@example.com" || cleanEmail === "admin@me.com") {
      if (password !== "123") return { ok: false, message: "Incorrect admin password." };
      setUser({ role: "admin", name: "Administrator", email: cleanEmail });
      return { ok: true };
    }
    const employee = employees.find(
      (item) => item.email.toLowerCase() === cleanEmail && item.password === password
    );
    if (!employee) return { ok: false, message: "Email or password is incorrect." };
    setUser({ role: "employee", id: employee.id, name: employee.firstName, email: employee.email });
    return { ok: true };
  }

  function logout() {
    setUser(null);
  }

  function createTask({ employeeId, taskTitle, taskDescription, taskDate, category }) {
    const task = {
      id: Date.now(),
      taskTitle: taskTitle.trim(),
      taskDescription: taskDescription.trim(),
      taskDate,
      category: category.trim(),
      status: "new"
    };
    setEmployees((current) =>
      current.map((employee) =>
        employee.id === Number(employeeId)
          ? { ...employee, tasks: [...employee.tasks, task] }
          : employee
      )
    );
    return task;
  }

  function updateTaskStatus(employeeId, taskId, status) {
    setEmployees((current) =>
      current.map((employee) =>
        employee.id !== Number(employeeId)
          ? employee
          : {
              ...employee,
              tasks: employee.tasks.map((task) =>
                task.id === Number(taskId) ? { ...task, status } : task
              )
            }
      )
    );
  }

  const value = { employees, user, login, logout, createTask, updateTaskStatus };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}