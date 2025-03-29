//src\components\dashboard\AdminDashboard.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../layout/Layout";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    // Si no hay token, redirigir al login
    if (!token) {
      router.push("/login");
      return;
    }

    // Decodificar el token
    const decodedToken = JSON.parse(atob(token.split(".")[1]));

    // Verificar si el rol es ADMIN, si no, redirigir al dashboard correspondiente
    if (decodedToken.role !== "ADMIN") {
      router.push("/dashboard"); // O redirigir a otra página o mostrar "Acceso Denegado"
      return;
    }

    // Guardar el rol en estado
    setRole(decodedToken.role);
  }, [router]);

  if (!role) return null; // Esperar a que el rol esté disponible antes de renderizar

  return (
    <Layout role={role}>
      {/* Sección de bienvenida */}
      <div className="mb-6">
        <p className="text-xl font-semibold text-gray-700">
          👋 ¡Bienvenido, Administrador!
        </p>
        <p className=" m-5 text-md text-gray-500">
          Aquí puedes visualizar el estado general del sistema.
        </p>
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 text-center">
            Usuarios registrados
          </h3>
          <p className="text-3xl mt-2 font-bold text-blue-500 text-center">
            45
          </p>
        </div>

        {/* Link a Gestionar Usuarios */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <Link href="/users">
            <h3 className="text-xl font-semibold text-gray-700 text-center">
              Gestionar Usuarios
            </h3>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
