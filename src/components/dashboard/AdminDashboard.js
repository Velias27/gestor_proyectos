import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si no hay token, redirigir al login
    if (!token) {
      router.push("/login");
      return;
    }

    // Decodificar el token
    const decodedToken = JSON.parse(atob(token.split('.')[1]));

    // Verificar si el rol es ADMIN, si no, redirigir al dashboard correspondiente
    if (decodedToken.role !== "ADMIN") {
      router.push("/dashboard"); // O redirigir a otra página o mostrar "Acceso Denegado"
    }
  }, [router]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Aquí iría el contenido específico para el Admin */}
    </div>
  );
}