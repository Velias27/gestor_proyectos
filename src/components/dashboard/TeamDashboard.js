import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../layout/Layout';

export default function TeamDashboard() {
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

    // Verificar si el rol es TEAM_MEMBER, si no, redirigir al dashboard correspondiente
    if (decodedToken.role !== "TEAM_MEMBER") {
      router.push("/dashboard"); // O redirigir a otra página o mostrar "Acceso Denegado"
      return;
    }

    // Guardar el rol en estado
    setRole(decodedToken.role);
  }, [router]);

  if (!role) return null; // Esperar a que el rol esté disponible antes de renderizar

  const handleRedirect = () => {
    // Redirigir a user/indexuser
    router.push("/projects");
  };

  return (
    <Layout role={role}>
      {/* Sección de bienvenida */}
      <div className="mb-6">
        <p className="text-lg text-gray-700">👋 ¡Hola, Miembro del equipo!</p>
        <p className="text-sm text-gray-500">Estas son tus tareas y prioridades actuales.</p>
      </div>

      {/* Botón para redirigir */}
      <div className="mt-6">
        <button
          onClick={handleRedirect}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          Mis proyectos
        </button>
      </div>

      <br/>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700">Tareas asignadas</h3>
          <p className="text-3xl mt-2 font-bold text-blue-500">14</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700">Tareas completadas</h3>
          <p className="text-3xl mt-2 font-bold text-green-500">8</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700">Pendientes por hoy</h3>
          <p className="text-3xl mt-2 font-bold text-red-500">3</p>
        </div>
      </div>
    </Layout>
  );
}