import { Outlet } from "react-router-dom";
import Header from "./Header";
import { ClerkProvider } from '@clerk/clerk-react'

function RootLayout() {
    const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <div>
      <Header />
      <main className="h-[100vh]">
        <Outlet />
      </main>
    </div>
    </ClerkProvider>
  );
}

export default RootLayout;
