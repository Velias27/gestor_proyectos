import React, { useState, useEffect } from "react";
import axios from "axios";
import UserModal from "@/components/userModal";
import Layout from "@/components/layout/Layout";
import Swal from "sweetalert2";
import {
  Pencil,
  Trash2,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function UsersDashboard() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [role, setRole] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) {
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split(".")[1]));
      
          if (decoded.role !== "ADMIN") {
            window.location.href = "/dashboard";
            return;
          }
      
          setRole(decoded.role);
        } catch (error) {
          console.error("Error decodificando el token:", error);
          window.location.href = "/login"; 
        }
      }      
    }
  }, [token]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error.response?.data);
      setIsLoading(false);

      window.location.href = "/dashboard";
      return;

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (userData) => {
    setIsLoading(true);
    try {
      if (editingUser) {
        await axios.put(`/api/users/${userData.id}`, userData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire({
          icon: "success",
          title: "¡Usuario actualizado!",
          text: `El usuario ${userData.name} ha sido actualizado correctamente`,
          confirmButtonColor: "#4b5563",
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        await axios.post("/api/users", userData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire({
          icon: "success",
          title: "¡Usuario creado!",
          text: `El usuario ${userData.name} ha sido creado correctamente`,
          confirmButtonColor: "#4b5563",
          timer: 2000,
          timerProgressBar: true,
        });
      }
      setIsLoading(false);
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      setIsLoading(false);
      console.error("Error al guardar usuario:", error);

      if (
        error.response?.data?.message?.includes("email") ||
        error.response?.status === 409
      ) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El correo electrónico ya está en uso. Por favor, intenta con otro.",
          confirmButtonColor: "#4b5563",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo guardar el usuario. Por favor, intenta de nuevo.",
          confirmButtonColor: "#4b5563",
        });
      }
    }
  };

  const handleDeleteUser = async (id, name) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Realmente quieres eliminar a ${name}? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#4b5563",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await axios.delete(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsLoading(false);

        Swal.fire({
          icon: "success",
          title: "Usuario eliminado",
          text: "El usuario ha sido eliminado correctamente",
          confirmButtonColor: "#4b5563",
          timer: 2000,
          timerProgressBar: true,
        });

        fetchUsers();
      } catch (error) {
        setIsLoading(false);
        console.error("Error al eliminar usuario:", error);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el usuario. Por favor, intenta de nuevo.",
          confirmButtonColor: "#4b5563",
        });
      }
    }
  };

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
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
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
          disabled={isLoading}
        >
          <UserPlus size={18} />
          Agregar Usuario
        </button>

        {isLoading && (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
          </div>
        )}

        <div className="customTableContainer">
          <table className="customTable">
            <thead className="bg-gray-50">
              <tr>
                <th className="customTableHeader w-1/12">ID</th>
                <th className="customTableHeader w-2/12">Nombre</th>
                <th className="customTableHeader w-3/12">Email</th>
                <th className="customTableHeader w-2/12">Rol</th>
                <th className="customTableHeader w-4/12">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="customTableData">{user.id}</td>
                    <td className="customTableData">{user.name}</td>
                    <td className="customTableData">{user.email}</td>
                    <td className="customTableData">{user.role}</td>
                    <td className="customTableData">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="bg-slate-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-slate-600 transition-colors"
                          disabled={isLoading}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="bg-red-400 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-red-500 transition-colors"
                          disabled={isLoading}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="customTableData text-center py-8">
                    {isLoading
                      ? "Cargando usuarios..."
                      : "No hay usuarios disponibles"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Paginación */}
          {users.length > usersPerPage && (
            <div className="flex justify-center items-center mt-4 gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className={`px-3 py-1 rounded flex items-center ${
                  currentPage === 1 || isLoading
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-slate-500 text-white hover:bg-slate-600"
                }`}
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    disabled={isLoading}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-slate-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    } ${isLoading ? "cursor-not-allowed opacity-70" : ""}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className={`px-3 py-1 rounded flex items-center ${
                  currentPage === totalPages || isLoading
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-slate-500 text-white hover:bg-slate-600"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
          initialData={editingUser}
        />
      </div>
    </Layout>
  );
}
