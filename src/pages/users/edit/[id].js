import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Button } from "@heroui/button";

export default function EditProject() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskComments, setTaskComments] = useState(""); // Comentarios de la nueva tarea
  const [taskStatus, setTaskStatus] = useState("PENDING"); // Estatus de la nueva tarea
  const [userId, setUserId] = useState(null); // Para almacenar el ID del usuario actual

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    // Decodificar el token para obtener el userId y el rol
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    
    // Verificar si el rol es TEAM_MEMBER, si no, redirigir al dashboard correspondiente
    if (decodedToken.role !== "TEAM_MEMBER") {
      router.push("/dashboard"); // O redirigir a otra página o mostrar "Acceso Denegado"
      return;
    }

    setUserId(decodedToken.id); // Guardamos el ID del usuario

    const fetchProject = async () => {
      try {
        const res = await axios.get(`/api/projects/${id}?assignedTo=${decodedToken.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(res.data.project);
        setTasks(res.data.project.tasks); // Solo tareas asignadas al usuario
      } catch (err) {
        console.error("Error al obtener el proyecto:", err);
        if (err.response && err.response.status === 403) {
          setError("No tienes permiso para ver este proyecto.");
        } else {
          setError("Error al obtener el proyecto.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, router]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `/api/tasks/${id}`,
        {
          title: taskTitle,
          assignedUsers: [userId], // Asignar solo al usuario actual
          status: taskStatus, // Estado de la nueva tarea
          comments: taskComments, // Comentarios de la nueva tarea
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks([...tasks, res.data.task]);
      setTaskTitle("");
      setTaskComments("");    // Limpiamos los comentarios
      setTaskStatus("PENDING"); // Limpiamos el estado
    } catch (err) {
      console.error("Error al añadir tarea:", err);
      setError("Error al añadir la tarea.");
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    const token = localStorage.getItem("token");
  
    try {
      const res = await axios.put(
        `/api/tasks/updateTask?taskId=${taskId}`,
        { status: newStatus },  // Solo pasamos el nuevo estado
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Si la respuesta es exitosa, actualizamos la tarea en el estado
      setTasks(tasks.map((task) => (task.id === taskId ? res.data.task : task)));
      setError(""); // Limpiamos el mensaje de error en caso de éxito
    } catch (err) {
      console.error("Error al actualizar el estado de la tarea:", err);
  
      // Si el error es 403 (no tiene permiso), mostramos un mensaje adecuado
      if (err.response && err.response.status === 403) {
        setError("No tienes permiso para actualizar esta tarea.");
      } else if (err.response && err.response.status === 400) {
        setError(err.response.data.error || "Error al actualizar la tarea.");
      } else {
        setError("Hubo un error al actualizar el estado de la tarea.");
      }
  
      // Esto es importante: no lanzamos el error para que no se dispare en Next.js
      // No debes usar "throw err" aquí. Axios ya lo ha manejado.
    }
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
        <header className="mb-6 flex items-center">
          <div className="flex-grow">
            {error && <p className="text-red-500">{error}</p>} {/* Mostrar el error al usuario */}
          </div>
        </header>

        {/* Mostrar solo las tareas asignadas al usuario */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Tareas asignadas para el proyecto</h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-4 bg-white p-4 rounded shadow-sm">
                <div className="flex-1">
                  <strong>{task.title}</strong>
                  <p className="text-gray-500">{task.comments}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                    className="border border-gray-300 rounded text-black px-3 py-2"
                  >
                    <option value="PENDING">Pendiente</option>
                    <option value="IN_PROGRESS">En Progreso</option>
                    <option value="BLOCKED">Bloqueado</option>
                    <option value="COMPLETED">Completado</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => router.push(`/projects`)}
            className="text-black px-4 py-2"
          >
            Volver a Proyectos
          </Button>
        </div>
      </div>
    </div>
  );
}