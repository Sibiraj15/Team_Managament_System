import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import AuthPage from "./pages/AuthPage.jsx";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <AuthPage onAuthenticated={setUser} />;
  }

  return (
    <Dashboard
      currentUser={user}
      onLogout={() => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        setUser(null);
      }}
    />
  );
}
