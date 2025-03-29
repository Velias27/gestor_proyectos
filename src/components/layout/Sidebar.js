// src/components/layout/Sidebar.js
import Link from "next/link";
import { LayoutGrid, Users, LogOut, Home, Briefcase } from "lucide-react";
import { useRouter } from "next/router";

const Sidebar = ({ role }) => {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <aside className="w-48 bg-slate-900 text-white min-h-screen p-6 flex flex-col justify-between">
      <div>
        <div className="mb-10 flex items-center gap-2">
          <h1 className="text-xl font-bold text-center">Gestor de Proyectos</h1>
        </div>

        <nav className="space-y-4">
          {role === "ADMIN" && (
            <>
              <Link
                href="/dashboard/admin"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors px-3 py-2 rounded"
              >
                <LayoutGrid size={20} /> Dashboard
              </Link>
              <Link
                href="/users"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors px-3 py-2 rounded"
              >
                <Users size={20} /> Usuarios
              </Link>
            </>
          )}
          {role === "PROJECT_MANAGER" && (
            <>
              <Link
                href="/dashboard/admin"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors px-3 py-2 rounded"
              >
                <LayoutGrid size={20} /> Dashboard
              </Link>
              <Link
                href="/projects"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors px-3 py-2 rounded"
              >
                <Briefcase  size={20} /> Proyectos
              </Link>
            </>
          )}
          {role === "TEAM" && (
            <Link
              href="/dashboard/team"
              className="flex items-center gap-2 hover:text-blue-400 transition-colors px-3 py-2 rounded"
            >
              <Home size={20} /> Team Dashboard
            </Link>
          )}
        </nav>
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 hover:text-red-400 transition-colors px-3 py-2 rounded w-full"
        >
          <LogOut size={20} />
          Salir
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
