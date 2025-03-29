import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { getDecodedToken } from "../../lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/login", { email, password });

      if (!data.token) {
        throw new Error("No se recibió token del servidor");
      }

      sessionStorage.setItem("token", data.token);

      // Depuración: muestra el token completo
      console.log("Token recibido:", data.token);

      const decoded = getDecodedToken(data.token);
      console.log("Token decodificado:", decoded); // Para verificar la estructura

      if (!decoded) {
        throw new Error("Token inválido");
      }

      if (!decoded.role) {
        throw new Error("El usuario no tiene un rol asignado");
      }

      // Redirigir según el rol
      switch (
        decoded.role.toUpperCase() // Convertir a mayúsculas para evitar problemas de case
      ) {
        case "ADMIN":
          router.push("/dashboard/admin");
          break;
        case "PROJECT_MANAGER":
          router.push("/dashboard/pm");
          break;
        case "TEAM_MEMBER":
          router.push("/dashboard/team");
          break;
        default:
          router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error || err.message || "Error al iniciar sesión"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
