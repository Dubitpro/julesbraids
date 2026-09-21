"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from "firebase/auth";
import { auth, getDb } from "@/src/lib/firebase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<UserCredential>;
  signUpWithEmail: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithEmail: async () => {
    throw new Error("AuthContext not initialized");
  },
  signUpWithEmail: async () => {
    throw new Error("AuthContext not initialized");
  },
  signInWithGoogle: async () => {
    throw new Error("AuthContext not initialized");
  },
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const fullName = `${firstName} ${lastName}`.trim();

    if (fullName && cred.user) {
      await updateProfile(cred.user, { displayName: fullName }).catch(console.error);
    }

    // Persist user record in Firestore lazily without blocking authentication
    try {
      const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
      const db = await getDb();
      if (db) {
        const userRef = doc(db, "users", cred.user.uid);
        await setDoc(
          userRef,
          {
            uid: cred.user.uid,
            email: cred.user.email,
            firstName,
            lastName,
            displayName: fullName,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.warn("Could not sync user profile to Firestore:", err);
    }

    return cred;
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);

    // Persist user record in Firestore lazily if new
    try {
      const { doc, setDoc, getDoc, serverTimestamp } = await import("firebase/firestore");
      const db = await getDb();
      if (db) {
        const userRef = doc(db, "users", cred.user.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          const [firstName, ...lastNameParts] = (cred.user.displayName || "").split(" ");
          await setDoc(
            userRef,
            {
              uid: cred.user.uid,
              email: cred.user.email,
              displayName: cred.user.displayName || "",
              firstName: firstName || "",
              lastName: lastNameParts.join(" ") || "",
              photoURL: cred.user.photoURL || "",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        }
      }
    } catch (err) {
      console.warn("Could not sync Google user profile to Firestore:", err);
    }

    return cred;
  };

  const logout = async () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
