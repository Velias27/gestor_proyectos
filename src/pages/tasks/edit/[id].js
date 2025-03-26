// pages/tasks/edit/[id].js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";

export default function EditTask() {
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Obtener datos de la tarea
  useEffect(() => {
    if (!id) return;
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    const fetchTask = async () => {
      try {
        const res = await axios.get(`/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(res.data.task);
        setTaskTitle(res.data.task.title);
        // Inicializamos los ids de usuarios asignados
        setSelectedTeamMembers(res.data.task.assignedUsers?.map(user => user.id) || []);

      } catch (err) {
        console.error("Error al obtener la tarea:", err);
        setError("Error al obtener la tarea.");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, router]);

  // Obtener la lista de team members
  useEffect(() => {
    const token = sessionStorage.getItem("token");
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

  const handleToggleEditingTitle = async () => {
    const token = sessionStorage.getItem("token");
    if (isEditingTitle) {
      // Confirmar actualización del título
      try {
        await axios.put(
          `/api/tasks/${id}`,
          { title: taskTitle },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTask({ ...task, title: taskTitle });
        setIsEditingTitle(false);
      } catch (error) {
        console.error("Error al actualizar el título:", error);
        setError("Error al actualizar el título de la tarea.");
      }
    } else {
      setIsEditingTitle(true);
    }
  };

  const handleUpdateAssignedUsers = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    try {
      await axios.put(
        `/api/tasks/${id}`,
        { assignedUsers: selectedTeamMembers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTask({
        ...task,
        assignedUsers: teamMembers.filter((member) =>
          selectedTeamMembers.includes(member.id)
        ),
      });
    } catch (error) {
      console.error("Error al actualizar los usuarios asignados:", error);
      setError("Error al actualizar los usuarios asignados.");
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
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-6 flex items-center">
          <div className="flex-grow">
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              disabled={!isEditingTitle}
              className={`text-3xl font-bold text-gray-800 bg-transparent w-full focus:outline-none ${
                isEditingTitle ? "border-b border-blue-500" : ""
              }`}
            />
          </div>
          <button
            onClick={handleToggleEditingTitle}
            className="ml-2 text-blue-600 hover:text-blue-800"
            title={isEditingTitle ? "Confirmar título" : "Editar título"}
          >
            {isEditingTitle ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-1.5a2.5 2.5 0 113.536 3.536L7 21H3v-4L16.732 3.732z"
                />
              </svg>
            )}
          </button>
        </header>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Card para actualizar los usuarios asignados */}
        <Card className="mb-6 shadow-lg rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-100 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700">
              Actualizar Usuarios Asignados
            </h2>
          </div>
          <div className="p-4 bg-white">
            <form onSubmit={handleUpdateAssignedUsers}>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">
                  Seleccionar usuarios
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {teamMembers.map((member) => (
                    <label
                      key={member.id}
                      className="inline-flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        value={member.id}
                        checked={selectedTeamMembers.includes(member.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTeamMembers((prev) => [
                              ...prev,
                              member.id,
                            ]);
                          } else {
                            setSelectedTeamMembers((prev) =>
                              prev.filter((id) => id !== member.id)
                            );
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">{member.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button type="submit" className="text-black px-4 py-2">
                Actualizar Usuarios
              </Button>
            </form>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={() => router.push(`/projects/edit/${task.projectId}`)}
            className="text-black px-4 py-2"
          >
            Volver al Proyecto
          </Button>
        </div>
      </div>
    </div>
  );
}
