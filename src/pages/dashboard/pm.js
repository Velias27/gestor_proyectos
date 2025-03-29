//src\pages\dashboard\pm.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { isAuthenticated, getDecodedToken } from "../../../lib/auth";

import PMDashboard from "../../components/dashboard/PMDashboard";

export default function PMPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const decoded = getDecodedToken();

    // Si el rol no es PROJECT_MANAGER, redirigir a otra página
    if (decoded?.role !== "PROJECT_MANAGER") {
      router.push("/dashboard");
    }
  }, [router]);

  return <PMDashboard />;
}
