export default function AdminDashboard() {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard de Administrador</h1>
  
        {/* Estadísticas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Usuarios" value="125" />
          <StatCard title="Proyectos" value="32" />
          <StatCard title="Tareas Activas" value="87" />
          <StatCard title="Miembros Inactivos" value="4" />
        </section>
  
        {/* Gestión de usuarios */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Usuarios registrados</h2>
          <div className="bg-white shadow rounded p-4 text-gray-600">
            Aquí irá la tabla de usuarios...
          </div>
        </section>
  
        {/* Gestión de proyectos */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Proyectos activos</h2>
          <div className="bg-white shadow rounded p-4 text-gray-600">
            Aquí irá la lista de proyectos...
          </div>
        </section>
      </div>
    );
  }
  
  function StatCard({ title, value }) {
    return (
      <div className="bg-white shadow rounded p-4 text-center">
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    );
  }
  