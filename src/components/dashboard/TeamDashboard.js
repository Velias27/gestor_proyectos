import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../layout/Layout';

export default function TeamDashboard() {
  const router = useRouter();
  const [role, setRole] = useState(null);

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
      return;
    }

    // Guardar el rol en estado
    setRole(decodedToken.role);
  }, [router]);

  if (!role) return null; // Esperar a que el rol esté disponible antes de renderizar

  return (
    <Layout role={role}>
      <h1 className="text-2xl font-bold mb-4 text-black">Contenido de Team Member</h1>
      {/* Aquí iría el contenido específico para el Team Member */}
    </Layout>
  );
}