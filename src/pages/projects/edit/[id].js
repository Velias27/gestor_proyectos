import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function EditProject() {
    const router = useRouter();
    const { id } = router.query;
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [taskTitle, setTaskTitle] = useState("");

    // Estados para manejar la asignación múltiple
    const [teamMembers, setTeamMembers] = useState([]);
    const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);

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
                console.log(res);
            } catch (err) {
                console.error("Error al obtener el proyecto:", err);
                setError("Error al obtener el proyecto.");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id, router]);

    // Obtener la lista de usuarios TEAM_MEMBER
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Cargando proyecto...</p>
            </div>
        );
    }

    return (
        <div className="p-8 bg-background text-foreground min-h-screen">
            <h1 className="text-2xl font-bold mb-4">
                Editar Proyecto: {project?.name}
            </h1>
            {error && <p className="text-red-500">{error}</p>}

            <div className="mb-8">
                <h2 className="text-xl mb-2">Tareas del proyecto</h2>
                {tasks && tasks.length > 0 ? (
                    <ul>
                        {tasks.map((task) => (
                            <li key={task.id} className="mb-1">
                                <strong>{task.title}</strong>
                                {task.assignedUsers?.length > 0 && (
                                    <span> - Asignado a: {task.assignedUsers.map(user => user.name).join(', ')}</span>
                                )}
                            </li>
                        ))}

                    </ul>
                ) : (
                    <p>No hay tareas para este proyecto.</p>
                )}
            </div>

            <div className="mb-4">
                <h2 className="text-xl mb-2">Añadir Tarea</h2>
                <form onSubmit={handleAddTask}>
                    <div className="mb-2">
                        <label className="block">Título de la tarea</label>
                        <input
                            type="text"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            className="border px-2 py-1 w-full"
                            placeholder="Ingresa el título"
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block">Asignar a (seleccionar usuarios)</label>
                        {teamMembers.map((member) => (
                            <div key={member.id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        value={member.id}
                                        checked={selectedTeamMembers.includes(member.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedTeamMembers([
                                                    ...selectedTeamMembers,
                                                    member.id,
                                                ]);
                                            } else {
                                                setSelectedTeamMembers(
                                                    selectedTeamMembers.filter((id) => id !== member.id)
                                                );
                                            }
                                        }}
                                    />
                                    {member.name}
                                </label>
                            </div>
                        ))}
                    </div>
                    <button
                        type="submit"
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                    >
                        Añadir Tarea
                    </button>
                </form>
            </div>
        </div>
    );
}
