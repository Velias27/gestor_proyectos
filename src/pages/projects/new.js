import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Layout from "@/components/layout/Layout";
import Swal from "sweetalert2";

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export default function NewProject() {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [startDate, setStartDate] = useState(getTodayDate());
  const [endDate, setEndDate] = useState("");
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setRole(decoded.role);
    } catch (error) {
      console.error("Error decodificando token:", error);
      localStorage.removeItem("token");
      router.replace("/login");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !startDate || !endDate) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Nombre, fecha de inicio y fecha de fin son obligatorios.",
        confirmButtonColor: "#4b5563",
      });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      Swal.fire({
        icon: "warning",
        title: "Fechas inválidas",
        text: "La fecha de inicio no puede ser posterior a la fecha de fin.",
        confirmButtonColor: "#4b5563",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token no encontrado");
      }

      await axios.post(
        "/api/projects",
        { name, comment, startDate, endDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "¡Proyecto creado!",
        text: "El proyecto se ha creado exitosamente.",
        confirmButtonColor: "#4b5563",
        timer: 2000,
        timerProgressBar: true,
      });

      router.push("/projects");
    } catch (error) {
      console.error("Error al crear proyecto:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el proyecto. Intenta nuevamente.",
        confirmButtonColor: "#4b5563",
      });

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.replace("/login");
      }
    }
  };

  if (!role) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <Layout role={role}>
      <div className="max-w-2xl mx-auto bg-white p-6 mt-10 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-black">Crear nuevo proyecto</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre del proyecto
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ej: CRM para ventas"
              className="px-4 py-2 mt-1 block w-full border-gray-300 rounded-md shadow-sm text-black focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
              Comentario
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Detalles adicionales..."
              rows={3}
              className="px-4 py-2 mt-1 block w-full border-gray-300 rounded-md shadow-sm text-black focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Fecha de inicio
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="px-4 py-2 mt-1 block w-full border-gray-300 rounded-md shadow-sm text-black focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Fecha de fin
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="px-4 py-2 mt-1 block w-full border-gray-300 rounded-md shadow-sm text-black focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Crear Proyecto
          </button>
        </form>
      </div>
    </Layout>
  );
}
