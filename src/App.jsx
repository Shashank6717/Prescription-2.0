import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RootLayout from "../src/components/RootLayout.jsx";
import Home from "./components/Home.jsx";
import Signin from "./components/SignIn.jsx";
import Signup from "./components/SignUp.jsx";
import DoctorDashBoard from "./components/DoctorDashBoard.jsx";
import Prescription from "./components/Prescription.jsx";
import PharmacistDashBoard from "./components/PharmacistDashBoard.jsx";
import UserAuthorContext from "./contexts/UserContext.jsx";
import ProtectRoute from "./components/ProtectRoute.jsx";

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { User } from "lucide-react";

export default function App() {
  const browserRouterObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "login", element: <Signin /> },
        { path: "register", element: <Signup /> },

        // Doctor Dashboard
        {
          path: "doctordash",
          element: <DoctorDashBoard />,
          children: [
            {
              index: true,
              element: <Navigate to="prescriptionfilling" replace />,
            },
            { path: "prescriptionfilling", element: <Prescription /> },
          ],
        },

        // Pharmacist Dashboard
        { path: "pharmacistdashboard", element: <PharmacistDashBoard /> },
      ],
    },
  ]);

  return (
    <StrictMode>
      <UserAuthorContext>
      <RouterProvider router={browserRouterObj} />
      </UserAuthorContext>
    </StrictMode>
  );
}
