import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TeamDashboard() {
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

    // Verificar si el rol es TEAM_MEMBER, si no, redirigir al dashboard correspondiente
    if (decodedToken.role !== "TEAM_MEMBER") {
      router.push("/dashboard"); // O redirigir a otra página o mostrar "Acceso Denegado"
    }
  }, [router]);

  return (
    <div>
      <h1>Team Member Dashboard</h1>
      {/* Aquí iría el contenido específico para el Team Member */}
    </div>
  );
}