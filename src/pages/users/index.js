// src/pages/users/users.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import UserModal from "../../components/userModal";

export default function UsersDashboard() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  const fetchUsers = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    try {
      const response = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error:", error.response?.data);
      if (error.response?.status === 401) {
        sessionStorage.removeItem("token");
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
    try {
      if (editingUser) {
        await axios.put(`/api/users/${userData.id}`, userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/users", userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>
      <button
        onClick={openAddModal}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Agregar Usuario
      </button>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 border whitespace-nowrap">
                  {user.id}
                </td>
                <td className="px-6 py-4 border whitespace-nowrap">
                  {user.name}
                </td>
                <td className="px-6 py-4 border whitespace-nowrap">
                  {user.email}
                </td>
                <td className="px-6 py-4 border whitespace-nowrap">
                  {user.role}
                </td>
                <td className="px-6 py-4 border whitespace-nowrap">
                  <button
                    onClick={() => openEditModal(user)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        initialData={editingUser}
      />
    </div>
  );
}
