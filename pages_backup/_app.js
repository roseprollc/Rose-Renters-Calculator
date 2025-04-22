import "../styles/globals.css"; // ✅ Tailwind CSS styles
import React from "react";
import AppLayout from "../src/App";
import { ThemeProvider } from "../src/context/ThemeContext";
import { AuthProvider } from "../src/context/AuthContext";
import { Auth0ProviderWithNavigate } from "../src/components/auth/auth0-provider";

function MyApp({ Component, pageProps }) {
  return (
    <Auth0ProviderWithNavigate>
      <AuthProvider>
        <ThemeProvider>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </ThemeProvider>
      </AuthProvider>
    </Auth0ProviderWithNavigate>
  );
}

export default MyApp;