import { useEffect, useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role) {
      setUser({ name: "Usuario Simulado", role });
    }

    setLoading(false);
  }, []);

  return { user, loading };
}
