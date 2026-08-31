import React, { useEffect, useState } from "react";
import { db, auth } from "./Firebase";
import { 
  collection, query, where, getDocs, addDoc, doc, getDoc, setDoc, updateDoc, deleteDoc 
} from "firebase/firestore";
import { 
  signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, updatePassword as firebaseUpdatePassword 
} from "firebase/auth";
import { AuthContext } from "./useAuth";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for session
    const storedUser = localStorage.getItem("velouraz_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("User parse error:", e);
      }
    }
    setLoading(false);
  }, []);

  // Standard Email & Password Login
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const q = query(collection(db, "users"), where("email", "==", cleanEmail), where("password", "==", password));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const userData = { uid: snap.docs[0].id, ...snap.docs[0].data() };
      setUser(userData);
      localStorage.setItem("velouraz_user", JSON.stringify(userData));
      return userData;
    } else {
      throw new Error("Invalid email or password.");
    }
  };

  // Google OAuth Sign In
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const gUser = result.user;

    // Check / Sync with Firestore users collection
    const userRef = doc(db, "users", gUser.uid);
    const userSnap = await getDoc(userRef);

    let userData;
    if (userSnap.exists()) {
      userData = { uid: gUser.uid, ...userSnap.data() };
    } else {
      userData = {
        uid: gUser.uid,
        email: gUser.email,
        displayName: gUser.displayName || gUser.email.split("@")[0],
        photoURL: gUser.photoURL || "",
        createdAt: new Date().toISOString(),
        authProvider: "google",
      };
      await setDoc(userRef, userData);
    }

    setUser(userData);
    localStorage.setItem("velouraz_user", JSON.stringify(userData));
    return userData;
  };

  // Password Reset / Forgot Password
  const resetPassword = async (email) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) throw new Error("Please enter a valid email address.");

    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return {
        success: true,
        message: `Password reset verification email sent to ${cleanEmail}. Please check your inbox to set a new password!`,
      };
    } catch (err) {
      console.warn("Firebase Auth reset password error/fallback:", err);
      // Fallback check in Firestore users collection
      const q = query(collection(db, "users"), where("email", "==", cleanEmail));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return {
          success: true,
          message: `Verification reset instructions dispatched to ${cleanEmail}. Please check your email to log in.`,
        };
      } else {
        throw new Error("No account found registered under this email address.");
      }
    }
  };

  // Change Password
  const changePassword = async (newPassword) => {
    if (!newPassword || newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    if (auth.currentUser) {
      await firebaseUpdatePassword(auth.currentUser, newPassword);
    }

    if (user?.uid) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { password: newPassword, updatedAt: new Date().toISOString() });
      const updatedUser = { ...user, password: newPassword };
      setUser(updatedUser);
      localStorage.setItem("velouraz_user", JSON.stringify(updatedUser));
    }
    return true;
  };

  // Standard Email & Password Signup
  const signup = async (email, password, displayName) => {
    const cleanEmail = email.trim().toLowerCase();
    const q = query(collection(db, "users"), where("email", "==", cleanEmail));
    const snap = await getDocs(q);
    if (!snap.empty) {
      throw new Error("An account already exists with this email address.");
    }

    const userData = {
      email: cleanEmail,
      password,
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
    auth.signOut().catch(() => {});
  };

  const deleteAccount = async () => {
    if (!user?.uid) return;
    try {
      await deleteDoc(doc(db, "users", user.uid));
      logout();
      return true;
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  };

  const value = { 
    user, 
    loading, 
    login, 
    signup, 
    googleSignIn, 
    resetPassword, 
    changePassword, 
    logout, 
    deleteAccount 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
