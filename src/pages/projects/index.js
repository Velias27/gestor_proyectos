import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Pencil, Trash } from "lucide-react";
import Swal from "sweetalert2";


export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    let decoded = null;

    try {
      decoded = JSON.parse(atob(token.split(".")[1]));
      
      if (decoded.role === "ADMIN") {
        router.replace("/dashboard/admin");
        return;
      }
    
      setRole(decoded.role);
      setUserId(decoded.userId);
    } catch (err) {
      console.error("Error al decodificar token", err);
      router.replace("/login");
      return;
    }
    

    const fetchProjects = async () => {
      try {
        const endpoint =
          decoded.role === "TEAM_MEMBER"
            ? "/api/projects/assigned"
            : "/api/projects";

        const res = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data =
        decoded.role === "TEAM_MEMBER"
          ? res.data.projects.filter((p) =>
              p.tasks.some((t) =>
                t.assignees.some((a) => a.id === decoded.userId)
              )
            )
          : res.data.projects;
      

        setProjects(data);
        console.log(data);
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

  const handleViewTasks = (projectId) => {
    router.push(`/projects/edit/${projectId}`);
  };

  if (!role || loading) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-r from-gray-50 to-white h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  const handleDeleteProject = async (id) => {
    const token = localStorage.getItem("token");
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el proyecto permanentemente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects((prev) => prev.filter((p) => p.id !== id));
        Swal.fire("Eliminado", "El proyecto ha sido eliminado", "success");
      } catch (err) {
        console.error("Error al eliminar proyecto:", err);
        Swal.fire("Error", "No se pudo eliminar el proyecto", "error");
      }
    }
  };


  return (
    <Layout role={role}>
      <div className="flex flex-col bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center mb-8 gap-6"
          >
            <h1 className="text-4xl font-extrabold text-gray-900">
              Mis Proyectos
            </h1>

            {role !== "TEAM_MEMBER" && (
              <Button
                onClick={handleAddProject}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-all duration-300"
              >
                Agregar Proyecto
              </Button>
            )}
          </motion.header>

          <Card className="shadow-lg rounded-lg overflow-hidden">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="p-4 bg-gray-100 border-b border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-700">
                Lista de Proyectos
              </h2>
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
                          {project.startDate
                            ? new Date(project.startDate).toDateString()
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.endDate
                            ? new Date(project.endDate).toDateString()
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.tasks?.length ?? 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end gap-3">
                          {role === "TEAM_MEMBER" ? (
                            <Button
                              onClick={() => handleViewTasks(project.id)}
                              variant="link"
                              className="text-blue-600 hover:underline"
                            >
                              Ver Tareas
                            </Button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(project.id)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Editar"
                              >
                                <Pencil size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="text-red-500 hover:text-red-700"
                                title="Eliminar"
                              >
                                <Trash size={18} />
                              </button>
                            </>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                    {projects?.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-4 text-center text-gray-500"
                        >
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
    </Layout>
  );
}
