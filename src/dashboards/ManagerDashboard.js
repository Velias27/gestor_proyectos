export default function ManagerDashboard() {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard de Project Manager</h1>
  
        {/* Proyectos asignados */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Mis proyectos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProjectCard name="Proyecto Alpha" progress={75} />
            <ProjectCard name="Proyecto Beta" progress={40} />
          </div>
        </section>
  
        {/* Tareas por estado */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Tareas del equipo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TaskStat title="Pendientes" value={15} />
            <TaskStat title="En Progreso" value={8} />
            <TaskStat title="Completadas" value={20} />
          </div>
        </section>
      </div>
    );
  }
  
  function ProjectCard({ name, progress }) {
    return (
      <div className="bg-white shadow rounded p-4">
        <h3 className="font-semibold text-gray-800 mb-2">{name}</h3>
        <div className="w-full bg-gray-200 h-3 rounded">
          <div
            className="bg-blue-500 h-3 rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">Progreso: {progress}%</p>
      </div>
    );
  }
  
  function TaskStat({ title, value }) {
    return (
      <div className="bg-white shadow rounded p-4 text-center">
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    );
  }
  