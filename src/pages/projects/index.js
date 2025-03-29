import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";
export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/projects", {
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Encabezado animado */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8 gap-6"
        >
          <h1 className="text-4xl font-extrabold text-gray-900">Mis Proyectos</h1>

          <Button
            onClick={handleAddProject}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-all duration-300"
          >
            Agregar Proyecto
          </Button>
        </motion.header>

        <Card className="shadow-lg rounded-lg overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 bg-gray-100 border-b border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-700">Lista de Proyectos</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="p-4 bg-white"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Fecha Inicio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Fecha Fin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Tareas
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {projects?.map((project) => (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {project.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.startDate ? new Date(project.startDate).toDateString() : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.endDate ? new Date(project.endDate).toDateString() : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.tasks.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          onClick={() => handleEdit(project.id)}
                          variant="link"
                          className="text-blue-600 hover:underline"
                        >
                          Editar
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                  {projects?.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No hay proyectos registrados.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          </motion.div>
        </Card>
      </div>
    </div>
  );
}
