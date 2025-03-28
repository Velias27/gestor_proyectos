import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Card } from "@heroui/card";
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
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]); // Usuarios seleccionados

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchProject = async () => {
      try {
        const res = await axios.get(`/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(res.data.project);
        setTasks(res.data.project.tasks);
      } catch (err) {
        console.error("Error al obtener el proyecto:", err);
        setError("Error al obtener el proyecto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const fetchTeamMembers = async () => {
      try {
        const res = await axios.get("/api/team-members", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeamMembers(res.data.teamMembers);
      } catch (err) {
        console.error("Error al obtener los usuarios:", err);
      }
    };
    fetchTeamMembers();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `/api/projects/${id}/tasks`,
        {
          title: taskTitle,
          assignedUsers: selectedTeamMembers,
          status: taskStatus, // Estado de la nueva tarea
          comments: taskComments, // Comentarios de la nueva tarea
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks([...tasks, res.data.task]);
      setTaskTitle("");
      setSelectedTeamMembers([]);
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
        `/api/projects/${id}/tasks/${taskId}`,
        {
          status: newStatus, // Actualizar el estado de la tarea
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(tasks.map(task => task.id === taskId ? res.data.task : task));
    } catch (err) {
      console.error("Error al actualizar el estado de la tarea:", err);
      setError("Error al actualizar el estado de la tarea.");
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
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Título de la tarea"
              required
              className="text-3xl font-bold text-gray-800 bg-transparent w-full focus:outline-none"
            />
          </div>
        </header>

        {/* Mostrar tareas existentes */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Tareas del Proyecto</h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-4 bg-white p-4 rounded shadow-sm">
                <div className="flex-1">
                  <strong>{task.title}</strong>
                  <p className="text-gray-500">{task.comments}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Dropdown para editar el estado */}
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

        {/* Formulario para añadir una nueva tarea */}
        <Card className="mb-6 shadow-lg rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-100 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700">Añadir Tarea</h2>
          </div>
          <div className="p-4 bg-white">
            <form onSubmit={handleAddTask}>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">Comentarios</label>
                <textarea
                  value={taskComments}
                  onChange={(e) => setTaskComments(e.target.value)}
                  className="border border-gray-300 rounded text-black w-full px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Ingresa comentarios"
                />
              </div>

              {/* Dropdown para el estatus */}
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">Estado</label>
                <select
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                  className="border border-gray-300 rounded text-black w-full px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="PENDING">Pendiente</option>
                  <option value="IN_PROGRESS">En Progreso</option>
                  <option value="BLOCKED">Bloqueado</option>
                  <option value="COMPLETED">Completado</option>
                </select>
              </div>

              {/* Dropdown para seleccionar usuarios */}
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">Asignar usuarios</label>
                <select
                  multiple
                  value={selectedTeamMembers}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    setSelectedTeamMembers(selectedOptions);
                  }}
                  className="border border-gray-300 rounded text-black w-full px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" className="text-black px-4 py-2">
                Añadir Tarea
              </Button>
            </form>
          </div>
        </Card>

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