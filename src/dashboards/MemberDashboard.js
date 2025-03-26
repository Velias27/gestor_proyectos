export default function MemberDashboard() {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Mi Panel de Tareas</h1>
  
        {/* Resumen de tareas */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TaskStat title="Pendientes" value={4} />
          <TaskStat title="En progreso" value={2} />
          <TaskStat title="Completadas" value={5} />
        </section>
  
        {/* Lista de tareas asignadas */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Mis tareas</h2>
          <div className="space-y-3">
            <TaskCard title="Actualizar documentación" status="Pendiente" />
            <TaskCard title="Revisar pull request #12" status="En progreso" />
            <TaskCard title="Prototipar pantalla de login" status="Completada" />
          </div>
        </section>
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
  
  function TaskCard({ title, status }) {
    const getStatusColor = () => {
      switch (status) {
        case "Pendiente":
          return "text-yellow-500";
        case "En progreso":
          return "text-blue-500";
        case "Completada":
          return "text-green-600";
        default:
          return "text-gray-500";
      }
    };
  
    return (
      <div className="bg-white shadow rounded p-4 flex justify-between items-center">
        <div>
          <p className="font-medium">{title}</p>
          <p className={`text-sm ${getStatusColor()}`}>{status}</p>
        </div>
        {status !== "Completada" && (
          <button className="text-sm text-green-600 hover:underline">
            Marcar como completada
          </button>
        )}
      </div>
    );
  }  