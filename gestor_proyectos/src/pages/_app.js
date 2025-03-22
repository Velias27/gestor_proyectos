import "@/styles/globals.css";
import { HeroUIProvider } from "@heroui/react";

function MyApp({ Component, pageProps }) {
  return (
    <HeroUIProvider>
      <Component {...pageProps} />
    </HeroUIProvider>
  );
}

export default MyApp;
