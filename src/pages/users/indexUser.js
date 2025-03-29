import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { isAuthenticated, getDecodedToken } from "../../../lib/auth"; // Importar helper de autenticación

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null); // Estado para almacenar el rol
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Recuperar token de localStorage

    // Si no hay token, redirigir al login
    if (!token) {
      router.replace("/login");
      return;
    }

    // Decodificar el token y verificar el rol
    const decodedToken = JSON.parse(atob(token.split('.')[1]));

    // Verificar si el rol es TEAM_MEMBER, si no, redirigir al dashboard correspondiente
    if (decodedToken.role !== "TEAM_MEMBER") {
      router.push("/dashboard"); // O redirigir a otra página si no tiene el rol adecuado
      return;
    }

    // Guardar el rol en el estado
    setRole(decodedToken.role);

    // Si tiene el rol correcto, cargar los proyectos
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,  // Incluir token en el header
          },
        });
        setProjects(res.data.projects);
      } catch (error) {
        console.error("Error al obtener proyectos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [router]);

  const handleEdit = (id) => {
    router.push(`/users/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Proyectos</h1>
        </header>

        <Card className="shadow-lg rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-100 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700">Mis asignaciones</h2>
          </div>

          <div className="p-4 bg-white">
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left border border-gray-200 rounded">
                <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Nombre</th>
                    <th className="py-3 px-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {projects?.map((project) => (
                    <tr key={project.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">{project.name}</td>
                      <td className="py-3 px-4 text-right">
                        <Button className="text-blue-600 hover:underline" onClick={() => handleEdit(project.id)} variant="link">
                          Ver mis Tareas
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {projects?.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-gray-500">
                        No hay proyectos registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}