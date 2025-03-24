import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

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
        const res = await axios.get("./projects", {
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
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando proyectos...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-background text-foreground min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Proyectos</h1>
        <button
          onClick={handleAddProject}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Agregar Proyecto
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-content1 rounded shadow">
          <thead>
            <tr className="text-left border-b border-divider">
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4">Tareas</th>
              <th className="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects?.map((project) => (
              <tr key={project.id} className="border-b border-muted">
                <td className="py-3 px-4">{project.name}</td>
                <td className="py-3 px-4">{project.tasks.length}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleEdit(project.id)}
                    className="text-sm text-primary hover:underline"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
            {projects?.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-muted">
                  No hay proyectos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
