// src/components/UserModal.js
import React, { useEffect, useState } from "react";

const UserModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(initialData?.role || "ADMIN");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setRole(initialData.role);
      setPassword("");
    } else {
      setName("");
      setEmail("");
      setRole("ADMIN");
      setPassword("");
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!name || !email || (!initialData && !password)) {
      alert("Por favor, completa los campos requeridos.");
      return;
    }
    const userData = {
      id: initialData ? initialData.id : undefined,
      name,
      email,
      role,
      ...(password && { password }),
    };
    onSave(userData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded shadow-lg max-w-lg w-full p-6">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Editar Usuario" : "Agregar Usuario"}
        </h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingresa el nombre"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa el email"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        {initialData ? (
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Contraseña (dejar en blanco para mantener actual):
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nueva contraseña (opcional)"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        ) : (
          <div className="mb-4">
            <label className="block mb-1 font-medium">Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa la contraseña"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Rol:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
            <option value="TEAM_MEMBER">TEAM_MEMBER</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
