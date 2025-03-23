// src/pages/login.js
import axios from "axios";
import { useState } from "react";
import { Button } from "@heroui/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/login", { email, password });
      // Guarda el token (por ejemplo, en localStorage)
      localStorage.setItem("token", data.token);
      // Redirige al dashboard (o a la ruta que necesites)
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="w-full max-w-md p-8 space-y-6 bg-content1 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>
        {error && <p className="text-red-500">{error}</p>}
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
              className="w-full px-3 py-2 border border-divider rounded"
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
              className="w-full px-3 py-2 border border-divider rounded"
            />
          </div>
          <div>
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
