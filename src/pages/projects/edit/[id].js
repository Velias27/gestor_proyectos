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

    const [teamMembers, setTeamMembers] = useState([]);
    const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [projectName, setProjectName] = useState("");

    useEffect(() => {
        if (!id) return;
        const token = sessionStorage.getItem("token");
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
                setProjectName(res.data.project.name);
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

    const handleAddTask = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem("token");
        try {
            const res = await axios.post(
                `/api/projects/${id}/tasks`,
                {
                    title: taskTitle,
                    assignedUsers: selectedTeamMembers,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setTasks([...tasks, res.data.task]);
            setTaskTitle("");
            setSelectedTeamMembers([]);
        } catch (err) {
            console.error("Error al añadir tarea:", err);
            setError("Error al añadir la tarea.");
        }
    };

    const handleToggleEditing = async () => {
        const token = sessionStorage.getItem("token");
        if (isEditing) {
            try {
                await axios.put(
                    `/api/projects/${id}`,
                    { name: projectName },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setIsEditing(false);
                setProject({ ...project, name: projectName });
            } catch (error) {
                console.error("Error al actualizar el nombre del proyecto:", error);
                setError("Error al actualizar el nombre del proyecto.");
            }
        } else {
            setIsEditing(true);
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
            <div className="max-w-4xl mx-auto px-4 py-8">
                <header className="mb-6 flex items-center">
                    <div className="flex-grow">
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            disabled={!isEditing}
                            className={`text-3xl font-bold text-gray-800 bg-transparent w-full focus:outline-none ${isEditing ? "border-b border-blue-500" : ""
                                }`}
                        />
                    </div>
                    <button
                        onClick={handleToggleEditing}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        title={isEditing ? "Confirmar actualización" : "Editar nombre"}
                    >
                        {isEditing ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </header>
                <Card className="mb-6 shadow-lg rounded-lg overflow-hidden">
                    <div className="p-4 bg-gray-100 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-700">Tareas del Proyecto</h2>
                    </div>
                    <div className="p-4 bg-white">
                        {tasks && tasks.length > 0 ? (
                            <ul className="space-y-2">
                                {tasks.map((task) => (
                                    <li
                                        key={task.id}
                                        className="border-b last:border-b-0 border-gray-200 py-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => router.push(`/tasks/edit/${task.id}`)}
                                    >
                                        <strong className="ml-2 text-gray-600">{task.title}</strong>
                                        {task.assignedUsers?.length > 0 && (
                                            <span className="ml-2 text-gray-600">
                                                - Asignado a:{" "}
                                                {task.assignedUsers.map((user) => user.name).join(", ")}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">No hay tareas para este proyecto.</p>
                        )}

                    </div>
                </Card>
                <Card className="shadow-lg rounded-lg overflow-hidden">
                    <div className="p-4 bg-gray-100 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-700">Añadir Tarea</h2>
                    </div>
                    <div className="p-4 bg-white">
                        <form onSubmit={handleAddTask}>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium text-gray-700">Título de la tarea</label>
                                <input
                                    type="text"
                                    value={taskTitle}
                                    onChange={(e) => setTaskTitle(e.target.value)}
                                    className="border border-gray-300 rounded text-black w-full px-3 py-2 focus:outline-none focus:border-blue-500"
                                    placeholder="Ingresa el título"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium text-gray-700">
                                    Asignar a (seleccionar usuarios)
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                    {teamMembers.map((member) => (
                                        <label key={member.id} className="inline-flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                value={member.id}
                                                checked={selectedTeamMembers.includes(member.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedTeamMembers((prev) => [...prev, member.id]);
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
