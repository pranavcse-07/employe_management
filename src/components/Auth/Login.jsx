import { useState } from "react";
import { BriefcaseBusiness, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthProvider.jsx";

export default function Login({ loginError, setLoginError }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submitHandler(event) {
    event.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      setLoginError(result.message);
      return;
    }
    setLoginError("");
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand-mark"><BriefcaseBusiness size={27} /></div>
        <p className="eyebrow">WORKSPACE PORTAL</p>
        <h1>Welcome back</h1>
        <p className="muted login-intro">Sign in to manage your work and tasks.</p>
        <form onSubmit={submitHandler} className="login-form">
          <label htmlFor="email">Email address</label>
          <div className="input-wrap"><Mail size={18} /><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required /></div>
          <label htmlFor="password">Password</label>
          <div className="input-wrap"><LockKeyhole size={18} /><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required /></div>
          {loginError && <p className="error-message">{loginError}</p>}
          <button className="button button-primary login-button" type="submit">Sign in</button>
        </form>
        <div className="demo-logins">
          <p className="muted">Demo accounts</p>
          <button type="button" onClick={() => { setEmail("admin@me.com"); setPassword("123"); setLoginError(""); }}>Fill admin login</button>
          <button type="button" onClick={() => { setEmail("pk@gmail.com"); setPassword("123"); setLoginError(""); }}>Fill employee login</button>
        </div>
      </section>
      <aside className="login-aside">
        <div className="aside-content">
          <span className="aside-pill">EMPLOYEE MANAGEMENT</span>
          <h2>Good work starts with a clear plan.</h2>
          <p>Keep tasks organized, follow progress, and help your team focus on what matters.</p>
          <div className="aside-stats"><div><strong>One place</strong><span>for your team</span></div><div><strong>Clear status</strong><span>for every task</span></div></div>
        </div>
      </aside>
    </main>
  );
}