import { useState } from "react";
import { apiClient } from "../api/client.js";

const initialRegister = {
  name: "",
  email: "",
  password: ""
};

const initialLogin = {
  email: "",
  password: ""
};

export default function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateRegister = () => {
    if (!registerForm.name.trim()) {
      return "Name is required";
    }

    if (!registerForm.email.trim()) {
      return "Email is required";
    }

    if (!registerForm.password.trim()) {
      return "Password is required";
    }

    if (registerForm.password.trim().length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  };

  const validateLogin = () => {
    if (!loginForm.email.trim()) {
      return "Email is required";
    }

    if (!loginForm.password.trim()) {
      return "Password is required";
    }

    return "";
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const validationError = validateRegister();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const data = await apiClient.post("/auth/register", registerForm);
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      onAuthenticated(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const validationError = validateLogin();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const data = await apiClient.post("/auth/login", loginForm);
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      onAuthenticated(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <div className="auth-layout">
        <section className="auth-brand-panel">
          <div className="auth-brand-top">
            <div className="auth-brand-mark">TM</div>
            <div>
              <p className="eyebrow">Secure Access</p>
              <h1>Team Management System</h1>
            </div>
          </div>

          <p className="page-copy auth-copy">
            Centralize team roles, resolve permissions by team, and manage access from one clean
            operational workspace.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <span className="auth-feature-kicker">Role-Based Access</span>
              <strong>Assign different roles in different teams</strong>
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-kicker">Resolved Permissions</span>
              <strong>Verify user permissions based on selected team</strong>
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-kicker">Operational Control</span>
              <strong>Manage users, teams, roles, and assignments from one console</strong>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-panel-head">
            <div>
              <p className="eyebrow">Workspace Login</p>
              <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
              <p className="page-copy">
                {mode === "login"
                  ? "Sign in to continue managing access across teams."
                  : "Register an admin account to access the management console."}
              </p>
            </div>
          </div>

          <div className="auth-toggle">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          {error ? <div className="feedback error">{error}</div> : null}

          {mode === "login" ? (
            <form className="form-grid auth-form" onSubmit={handleLogin}>
              <label className="full-width">
                <span>Email <span className="required-mark">*</span></span>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="Enter your work email"
                  required
                />
              </label>
              <label className="full-width">
                <span>Password <span className="required-mark">*</span></span>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((current) => ({ ...current, password: event.target.value }))
                  }
                  placeholder="Enter your password"
                  required
                />
              </label>
              <div className="full-width auth-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Login"}
                </button>
              </div>
            </form>
          ) : (
            <form className="form-grid auth-form" onSubmit={handleRegister}>
              <label>
                <span>Name <span className="required-mark">*</span></span>
                <input
                  value={registerForm.name}
                  onChange={(event) =>
                    setRegisterForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Enter your name"
                  required
                />
              </label>
              <label>
                <span>Email <span className="required-mark">*</span></span>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(event) =>
                    setRegisterForm((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="Enter your work email"
                  required
                />
              </label>
              <label className="full-width">
                <span>Password <span className="required-mark">*</span></span>
                <input
                  type="password"
                  minLength="6"
                  value={registerForm.password}
                  onChange={(event) =>
                    setRegisterForm((current) => ({ ...current, password: event.target.value }))
                  }
                  placeholder="Create a password"
                  required
                />
              </label>
              <div className="full-width auth-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Creating account..." : "Register"}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
