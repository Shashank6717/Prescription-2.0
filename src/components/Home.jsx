import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Users, Phone, ArrowRight, UserCog, Pill } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { userAuthorContextObj } from "../contexts/UserContext";
import { db } from "../../firebaseConfig";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Loader from "./Loader";

const Home = () => {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { isSignedIn, user, isLoaded } = useUser();
  const [selectedRole, setSelectedRole] = useState(currentUser.role || "");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && user) {
      setCurrentUser({
        ...currentUser,
        firstName: user.firstName,
        lastName: user?.lastName || "",
        email: user.emailAddresses[0].emailAddress,
        profileImageUrl: user.imageUrl,
      });
    }
  }, [isLoaded, isSignedIn, user]);

  const handleRoleSelect = async (role) => {
    try {
      setError("");
      const userEmail = user.emailAddresses[0].emailAddress;

      // Check if user already exists in Firebase
      const userRef = doc(db, "userData", user.id);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        // If user exists and has a different role
        if (userData.role && userData.role !== role) {
          setError(
            `This email is already registered as a ${userData.role}. Please use a different account for ${role} role.`
          );
          return;
        }
      } else {
        // Check if email exists with a different role
        const usersRef = collection(db, "userData");
        const q = query(usersRef, where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const existingUser = querySnapshot.docs[0].data();
          if (existingUser.role !== role) {
            setError(
              `This email is already registered as a ${existingUser.role}. Please use a different account for ${role} role.`
            );
            return;
          }
        }
      }

      // If we get here, either:
      // 1. User doesn't exist in Firebase
      // 2. User exists but has no role
      // 3. User exists with the same role
      // 4. Email exists with the same role

      // Update local state and context
      setSelectedRole(role);
      const updatedUser = {
        ...currentUser,
        role: role,
      };
      setCurrentUser(updatedUser);

      // Store in localStorage
      localStorage.setItem("currentuser", JSON.stringify(updatedUser));

      // Store in Firebase
      await setDoc(
        userRef,
        {
          ...updatedUser,
          lastUpdated: new Date().toISOString(),
        },
        { merge: true }
      );

      // Auto redirect after 2 seconds
      setTimeout(() => {
        navigate(role === "doctor" ? "/doctordash" : "/pharmacistdashboard");
      }, 2000);
    } catch (error) {
      console.error("Error updating user data:", error);
      setError("An error occurred while updating your role. Please try again.");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-[90vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {!isSignedIn ? (
        <div className="text-center mb-16 my-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Secure Prescription Verification System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Ensuring safe and verified medication dispensing for healthcare
            professionals
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Secure Verification
              </h3>
              <p className="text-gray-600">
                QR code-based prescription verification system ensuring
                medication safety
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                For Healthcare Professionals
              </h3>
              <p className="text-gray-600">
                Dedicated dashboards for doctors and pharmacists
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Phone className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
              <p className="text-gray-600">
                Intuitive interface for quick and efficient prescription
                management
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mb-16 my-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome {currentUser?.firstName}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Please select your role to continue
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-6">
              <label className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-blue-500">
                <input
                  type="radio"
                  name="role"
                  value="doctor"
                  checked={selectedRole === "doctor"}
                  onChange={() => handleRoleSelect("doctor")}
                  className="absolute top-4 right-4 h-5 w-5 text-blue-600"
                />
                <UserCog className="h-16 w-16 text-blue-600 mb-4" />
                <span className="text-xl font-semibold mb-2">Doctor</span>
                <span className="text-gray-600 text-center">
                  Create and manage prescriptions for your patients
                </span>
              </label>

              <label className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-blue-500">
                <input
                  type="radio"
                  name="role"
                  value="pharmacist"
                  checked={selectedRole === "pharmacist"}
                  onChange={() => handleRoleSelect("pharmacist")}
                  className="absolute top-4 right-4 h-5 w-5 text-blue-600"
                />
                <Pill className="h-16 w-16 text-blue-600 mb-4" />
                <span className="text-xl font-semibold mb-2">Pharmacist</span>
                <span className="text-gray-600 text-center">
                  Verify and dispense prescriptions safely
                </span>
              </label>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {selectedRole && !error && (
              <div className="mt-8">
                <p className="text-blue-600 mb-4">
                  Redirecting to dashboard in 2 seconds...
                </p>
                <div className="w-48 h-2 bg-gray-200 rounded-full mx-auto">
                  <div className="w-0 h-full bg-blue-600 rounded-full animate-[progress_2s_ease-in-out_forwards]"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
