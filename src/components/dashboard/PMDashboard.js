import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../layout/Layout';

export default function PMDashboard() {
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si no hay token, redirigir al login
    if (!token) {
      router.push("/login");
      return;
    }

    // Decodificar el token
    const decodedToken = JSON.parse(atob(token.split('.')[1]));

    // Verificar si el rol es PROJECT_MANAGER, si no, redirigir al dashboard correspondiente
    if (decodedToken.role !== "PROJECT_MANAGER") {
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
        <p className="text-lg text-gray-700">👋 ¡Hola, Project Manager!</p>
        <p className="text-sm text-gray-500">Aquí tienes un resumen de tus proyectos y tareas.</p>
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700">Proyectos gestionados</h3>
          <p className="text-3xl mt-2 font-bold text-blue-500">6</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700">Tareas asignadas</h3>
          <p className="text-3xl mt-2 font-bold text-purple-500">28</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700">Miembros del equipo</h3>
          <p className="text-3xl mt-2 font-bold text-green-500">10</p>
        </div>
      </div>
    </Layout>
  );
}