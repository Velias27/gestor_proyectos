import { useRouter } from "next/router";
import { LogOut } from "lucide-react";

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">Panel de Usuario</h1>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-all"
      >
        <LogOut size={16} />
        Salir
      </button>
    </header>
  );
};

export default Header;
