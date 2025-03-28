import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      console.log("No token found, redirecting to login..."); // Log si no hay token
      router.push("/login"); // Si no hay token, redirigimos al login
      return;
    }

    // Decodificamos el token para obtener el rol
    try {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decodificamos el token manualmente
      const role = decoded.role;

      console.log("Decoded token:", decoded); // Log para ver el contenido del token
      console.log("User role:", role); // Log para ver el rol del usuario

      // Redirigimos a los dashboards según el rol
      if (role === "ADMIN") {
        console.log("Redirecting to Admin dashboard..."); // Log cuando se redirige al Admin
        router.push("/dashboard/admin");
      } else if (role === "PROJECT_MANAGER") {
        console.log("Redirecting to PM dashboard..."); // Log cuando se redirige al PM
        router.push("/dashboard/pm");
      } else if (role === "TEAM_MEMBER") {
        console.log("Redirecting to Team Member dashboard..."); // Log cuando se redirige al Team Member
        router.push("/dashboard/team");
      } else {
        console.log("Role not recognized, redirecting to login..."); // Log si el rol no es reconocido
        router.push("/login"); // Si no tiene rol reconocido
      }
    } catch (error) {
      console.error("Error decoding token:", error); // Log si ocurre un error al decodificar el token
      router.push("/login"); // Si hay un error, redirigimos al login
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Redirigiendo...</p>
    </div>
  );
}