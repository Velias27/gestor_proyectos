import useAuth from "@/hooks/useAuth";
import AdminDashboard from "@/dashboards/AdminDashboard";
import ManagerDashboard from "@/dashboards/ManagerDashboard";
import MemberDashboard from "@/dashboards/MemberDashboard";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-4">Cargando...</div>;
  if (!user) return <div className="p-4">No has iniciado sesión.</div>;

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "manager":
      return <ManagerDashboard />;
    case "member":
      return <MemberDashboard />;
    default:
      return <div className="p-4">Rol no reconocido.</div>;
  }
}