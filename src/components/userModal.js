import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const UserModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(initialData?.role || "ADMIN");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setRole(initialData.role || "ADMIN");
      setPassword("");
    } else {
      setName("");
      setEmail("");
      setRole("ADMIN");
      setPassword("");
    }

    setErrors({
      name: "",
      email: "",
      password: "",
    });
  }, [initialData, isOpen]);

  // Función para validar email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para validar el formulario
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
    };

    // Validar nombre
    if (!name.trim()) {
      newErrors.name = "El nombre es requerido";
      valid = false;
    } else if (name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
      valid = false;
    }

    // Validar email
    if (!email.trim()) {
      newErrors.email = "El email es requerido";
      valid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = "El formato del email no es válido";
      valid = false;
    }

    // Validar contraseña
    if (!initialData && !password) {
      newErrors.password = "La contraseña es requerida";
      valid = false;
    } else if (!initialData && password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const userData = {
        id: initialData ? initialData.id : undefined,
        name: name.trim(),
        email: email.trim(),
        role,
        ...(password && { password }),
      };

      onSave(userData);
    }
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
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: "" });
            }}
            placeholder="Ingresa el nombre"
            className={`customInput ${errors.name ? "border-red-500" : ""}`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            placeholder="Ingresa el email"
            className={`customInput ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        {initialData ? (
          <div className="mb-4">
            <label className="block mb-1 font-medium">Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              placeholder="Nueva contraseña (opcional)"
              className={`customInput ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <label className="block mb-1 font-medium">Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              placeholder="Ingresa la contraseña"
              className={`customPassword ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
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
        <div className="flex justify-end space-x-4 mt-10">
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
