// pages/projects/edit/[id].js

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import Swal from "sweetalert2";
import { Pencil, PlusCircle, ArrowLeft } from "lucide-react";

export default function EditProject() {
  const router = useRouter();
  const { id } = router.query;

  const [project, setProject] = useState(null);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskStatus, setTaskStatus] = useState("PENDING");
  const [taskComments, setTaskComments] = useState("");
  const [taskAssignees, setTaskAssignees] = useState([]);

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("token");
    if (!token) return router.replace("/login");

    const fetchData = async () => {
      try {
        const [projectRes, teamRes] = await Promise.all([
          axios.get(`/api/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/team-members", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const p = projectRes.data.project;
        setProject(p);
        setName(p.name);
        setComment(p.comment || "");
        setStartDate(p.startDate?.split("T")[0] || "");
        setEndDate(p.endDate?.split("T")[0] || "");
        setTasks(p.tasks);
        setTeamMembers(teamRes.data.teamMembers);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };
    fetchData();
  }, [id]);

  const reloadProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const p = res.data.project;
      setProject(p);
      setName(p.name);
      setComment(p.comment || "");
    } catch (err) {
      console.error("Error al recargar proyecto:", err);
    }
  };

  const updateField = async (field, value) => {
    if (field === "name" && !value.trim()) {
      reloadProject();
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/projects/${id}`,
        { [field]: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(`Error actualizando ${field}:`, err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `/api/projects/${id}/tasks`,
        {
          title: taskTitle,
          comments: taskComments,
          status: taskStatus,
          assignedUsers: taskAssignees,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks([...tasks, res.data.task]);
      setShowModal(false);
      setTaskTitle("");
      setTaskComments("");
      setTaskStatus("PENDING");
      setTaskAssignees([]);
    } catch (err) {
      console.error("Error creando tarea:", err);
      Swal.fire("Error", "No se pudo crear la tarea", "error");
    }
  };

  if (!project) {
    return <div className="p-10 text-center">Cargando proyecto...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Botón de volver */}
      <div className="mb-4">
        <Button
          onClick={() => router.push("/projects")}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600"
          variant="ghost"
        >
          <ArrowLeft size={18} /> Volver a proyectos
        </Button>
      </div>

      {/* Encabezado editable */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 bg-white p-4 rounded-xl shadow">
        <div className="w-full md:w-2/3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => updateField("name", name)}
            className="text-2xl font-bold w-full bg-transparent text-gray-800 focus:outline-none"
          />
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onBlur={() => updateField("comment", comment)}
            placeholder="Comentario..."
            className="mt-1 w-full bg-transparent text-gray-600 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2 mt-4 md:mt-0 w-full md:w-1/3">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Inicio</label>
            <p className="text-black font-medium px-2 py-1 bg-gray-100 rounded">
              {startDate || "-"}
            </p>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mt-1">Fin</label>
            <p className="text-black font-medium px-2 py-1 bg-gray-100 rounded">
              {endDate || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Botón para añadir tarea */}
      <div className="mb-4">
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <PlusCircle size={18} /> Añadir Tarea
        </Button>
      </div>

      {/* Lista de tareas estilo checklist visual */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-4 bg-white p-4 rounded-lg shadow border-l-4 border-blue-500"
          >
            <input
              type="checkbox"
              checked={task.completed}
              readOnly
              className="mt-1 accent-blue-600"
            />
            <div>
              <p className="font-semibold text-gray-800">{task.title}</p>
              {task.comments && <p className="text-sm text-gray-500">{task.comments}</p>}
              <p className="text-xs text-gray-400 italic">
                Estado: {task.status} | Asignado: {task.assignee?.name || "No asignado"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de nueva tarea */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Nueva Tarea</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Título"
                className="w-full border px-4 py-2 rounded"
                required
              />
              <textarea
                value={taskComments}
                onChange={(e) => setTaskComments(e.target.value)}
                placeholder="Comentarios"
                className="w-full border px-4 py-2 rounded resize-none"
              />
              <select
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="PENDING">Pendiente</option>
                <option value="IN_PROGRESS">En progreso</option>
                <option value="BLOCKED">Bloqueado</option>
                <option value="COMPLETED">Completado</option>
              </select>
              <div>
                <p className="font-medium text-gray-700 mb-1">Asignar usuarios:</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {teamMembers.map((member) => (
                    <label key={member.id} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        value={member.id}
                        checked={taskAssignees.includes(member.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTaskAssignees([...taskAssignees, member.id]);
                          } else {
                            setTaskAssignees(taskAssignees.filter((id) => id !== member.id));
                          }
                        }}
                      />
                      {member.name}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 text-white">
                  Crear
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
