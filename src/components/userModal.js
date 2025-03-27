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
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-500/50">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6">
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
            className="customInput"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa el email"
            className="customInput"
          />
        </div>
        {initialData ? (
          <div className="mb-4">
            <label className="block mb-1 font-medium">Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nueva contraseña (opcional)"
              className="customInput"
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
              className="customPassword"
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Rol:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="customSelect"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
            <option value="TEAM_MEMBER">TEAM_MEMBER</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4  mt-10">
          <button onClick={onClose} className="customButtonSecondary">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="customButtonMain">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
