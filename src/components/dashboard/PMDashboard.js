import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../layout/Layout";
import { Button } from "@heroui/button"; // Asegúrate de importar el componente Button

export default function PMDashboard() {
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

    // Verificar si el rol es PROJECT_MANAGER, si no, redirigir al dashboard correspondiente
    if (decodedToken.role !== "PROJECT_MANAGER") {
      router.push("/dashboard"); // O redirigir a otra página o mostrar "Acceso Denegado"
      return;
    }

    // Guardar el rol en estado
    setRole(decodedToken.role);
  }, [router]);

  // Función para redirigir a la página de proyectos
  const goToProjects = () => {
    router.push("/projects"); // Redirige a /projects
  };

  if (!role) return null; // Esperar a que el rol esté disponible antes de renderizar

  return (
    <Layout role={role}>
      <div className="min-h-screen p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Project Manager Dashboard
        </h1>

        <div className="space-y-6">
          {/* Botón para ir a la lista de proyectos */}
          <Button
            onClick={goToProjects}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            Ir a Proyectos
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-lg text-gray-700">👋 ¡Hola, Project Manager!</p>
          <p className="text-sm text-gray-500">
            Aquí tienes un resumen de tus proyectos y tareas.
          </p>
        </div>

        {/* Tarjetas de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700">
              Proyectos gestionados
            </h3>
            <p className="text-3xl mt-2 font-bold text-blue-500">6</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700">
              Tareas asignadas
            </h3>
            <p className="text-3xl mt-2 font-bold text-purple-500">28</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700">
              Miembros del equipo
            </h3>
            <p className="text-3xl mt-2 font-bold text-green-500">10</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
