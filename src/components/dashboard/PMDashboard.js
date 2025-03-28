import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../layout/Layout';

export default function PMDashboard() {
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

    // Verificar si el rol es PROJECT_MANAGER, si no, redirigir al dashboard correspondiente
    if (decodedToken.role !== "PROJECT_MANAGER") {
      router.push("/dashboard"); // O redirigir a otra página o mostrar "Acceso Denegado"
      return;
    }

    // Guardar el rol en estado
    setRole(decodedToken.role);
  }, [router]);

  if (!role) return null; // Espera a que el rol esté disponible antes de renderizar

  return (
    <Layout role={role}>
      <h1 className="text-2xl font-bold mb-4 text-black">Contenido de Project Manager</h1>
      {/* Aquí iría el contenido específico para el Project Manager */}
    </Layout>
  );
}