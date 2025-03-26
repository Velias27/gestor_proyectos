import "@/styles/globals.css";
import { HeroUIProvider } from "@heroui/react";
import Layout from "@/components/layout/Layout";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const noLayoutRoutes = ["/login"];
  const useLayout = !noLayoutRoutes.includes(router.pathname);

  const content = <Component {...pageProps} />;

  return (
    <HeroUIProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {useLayout ? <Layout>{content}</Layout> : content}
      </div>
    </HeroUIProvider>
  );
}

export default MyApp;
