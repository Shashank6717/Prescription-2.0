import React from "react";
import { SignIn } from "@clerk/clerk-react";
function Signin() {
  return (
    <div className="mx-[100px]">
      <SignIn />
    </div>
  );
}

export default Signin;
