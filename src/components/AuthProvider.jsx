import React, { useEffect, useState } from "react";
import { db } from "./Firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "./useAuth";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for session
    const storedUser = localStorage.getItem("velouraz_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const q = query(collection(db, "users"), where("email", "==", email), where("password", "==", password));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const userData = { uid: snap.docs[0].id, ...snap.docs[0].data() };
      setUser(userData);
      localStorage.setItem("velouraz_user", JSON.stringify(userData));
      return userData;
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const signup = async (email, password, displayName) => {
    // Check if user already exists
    const q = query(collection(db, "users"), where("email", "==", email));
    const snap = await getDocs(q);
    if (!snap.empty) {
      throw new Error("User already exists");
    }

    const userData = {
      email,
      password, // Note: In a real app, never store passwords in plain text!
      displayName,
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, "users"), userData);
    const finalUser = { uid: docRef.id, ...userData };
    setUser(finalUser);
    localStorage.setItem("velouraz_user", JSON.stringify(finalUser));
    return finalUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("velouraz_user");
  };

  const deleteAccount = async () => {
    if (!user?.uid) return;
    try {
      const { deleteDoc, doc } = await import("firebase/firestore");
      await deleteDoc(doc(db, "users", user.uid));
      logout();
      return true;
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  };

  const value = { user, loading, login, signup, logout, deleteAccount };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
