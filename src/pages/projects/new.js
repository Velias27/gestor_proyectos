import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function NewProject() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");  // Usar localStorage en vez de sessionStorage
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");  // Usar localStorage para obtener el token
      if (!token) {
        setError("Token no encontrado, por favor inicia sesión.");
        router.replace("/login");
        return;
      }

      await axios.post(
        "/api/projects",  // Cambié la ruta de "relativa" a "absoluta"
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push("/projects");
    } catch (err) {
      console.error("Error al crear proyecto:", err);
      setError("No se pudo crear el proyecto.");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl text-black font-bold mb-4">Crear nuevo proyecto</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="projectName"
              className="block mb-1 font-medium text-gray-700"
            >
              Nombre del proyecto
            </label>
            <input
              id="projectName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ejemplo: Mi primer proyecto"
              required
              className="border text-black border-gray-300 rounded w-full px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            Crear Proyecto
          </button>
        </form>
      </div>
    </div>
  );
}