import React from "react";
import { Outlet } from "react-router-dom";

function DoctorDashBoard() {
  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <Outlet />
    </div>
  );
}

export default DoctorDashBoard;
