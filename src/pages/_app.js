import "../styles/globals.css";
import { HeroUIProvider } from "@heroui/react";

function MyApp({ Component, pageProps }) {
  return (
    <HeroUIProvider>
      <div className="dark text-foreground bg-background">
        <Component {...pageProps} />
      </div>
    </HeroUIProvider>
  );
}

export default MyApp;
