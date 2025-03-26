import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("role");
    sessionStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow">
      <h1 className="text-xl font-semibold text-gray-800">Gestor de Proyectos</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Cerrar sesión
      </button>
    </header>
  );
}
