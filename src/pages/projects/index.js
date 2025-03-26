import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import { Card } from "@heroui/card";
import { Button } from "@heroui/button";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchProjects = async () => {
      try {
        const res = await axios.get("../api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const handleAddProject = () => {
    router.push("/projects/new");
  };

  const handleEdit = (id) => {
    router.push(`/projects/edit/${id}`);
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
          <Button onClick={handleAddProject} className="px-4 py-2 text-blue-600">
            Agregar Proyecto
          </Button>
        </header>

        <Card className="shadow-lg rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-100 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700">
              Lista de Proyectos
            </h2>
          </div>

          <div className="p-4 bg-white">
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left border border-gray-200 rounded">
                <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Nombre</th>
                    <th className="py-3 px-4 font-semibold">Tareas</th>
                    <th className="py-3 px-4 font-semibold text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {projects?.map((project) => (
                    <tr
                      key={project.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">{project.name}</td>
                      <td className="py-3 px-4">{project.tasks.length}</td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          className="text-blue-600 hover:underline"
                          onClick={() => handleEdit(project.id)}
                          variant="link" 
                        >
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {projects?.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center py-4 text-gray-500"
                      >
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
