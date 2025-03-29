import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../layout/Layout";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const decodedToken = JSON.parse(atob(token.split(".")[1]));

    if (decodedToken.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }

    setRole(decodedToken.role);

    fetchUserCount();
  }, [router]);

  const fetchUserCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserCount(data.users.length);
      } else {
        console.error("Error al obtener usuarios");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!role) return null;

  return (
    <Layout role={role}>
      {/* Bienvenida */}
      <div className="mb-6">
        <p className="text-xl font-semibold text-gray-700">
          👋 ¡Bienvenido, Administrador!
        </p>
        <p className="m-5 text-md text-gray-500">
          Aquí puedes visualizar el estado general del sistema.
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta de Usuarios registrados */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col h-full">
          <h3 className="text-xl font-semibold text-gray-700 text-center">
            Usuarios registrados
          </h3>
          <p className="text-3xl mt-2 font-bold text-blue-500 text-center flex-grow flex items-center justify-center">
            {loading ? "Cargando..." : userCount}
          </p>
        </div>

        {/* Botón Gestionar Usuarios */}
        <Link href="/users" className="block h-full">
          <div className="bg-blue-100 hover:bg-blue-200 shadow-md rounded-lg p-6 flex flex-col h-full justify-center transition-colors duration-200">
            <h3 className="text-xl font-semibold text-blue-700 text-center">
              Gestionar Usuarios
            </h3>
          </div>
        </Link>
      </div>
    </Layout>
  );
}
