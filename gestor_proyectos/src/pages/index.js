// src/pages/index.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtiene el token desde localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Si existe token, redirige al dashboard
      router.push("/dashboard");
    } else {
      // Si no existe token, redirige al login
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  return null;
}
