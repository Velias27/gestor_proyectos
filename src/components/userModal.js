//src\pages\users\userModal.js
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@heroui/react";

const userModal = ({ isOpen, onClose, onSave, initialData }) => {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          {initialData ? "Editar Usuario" : "Agregar Usuario"}
        </ModalHeader>
        <ModalBody>
          <div className="mb-4">
            <label className="block font-medium mb-1">Nombre:</label>
            <Input
              value={name}
              onValueChange={setName}
              placeholder="Ingresa el nombre"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Email:</label>
            <Input
              value={email}
              onValueChange={setEmail}
              placeholder="Ingresa el email"
            />
          </div>
          {initialData ? (
            <div className="mb-4">
              <label className="block font-medium mb-1">
                Contraseña (dejar en blanco para mantener actual):
              </label>
              <Input
                type="password"
                value={password}
                onValueChange={setPassword}
                placeholder="Nueva contraseña (opcional)"
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block font-medium mb-1">Contraseña:</label>
              <Input
                type="password"
                value={password}
                onValueChange={setPassword}
                placeholder="Ingresa la contraseña"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block font-medium mb-1">Rol:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-divider rounded px-2 py-1 w-full"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
              <option value="TEAM_MEMBER">TEAM_MEMBER</option>
            </select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancelar
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default userModal;
