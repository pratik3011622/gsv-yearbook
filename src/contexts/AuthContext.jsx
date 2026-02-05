import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase.config";
import { api } from "../lib/api";

/* ================= CONTEXT ================= */

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

/* ================= PROVIDER ================= */

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Start true to prevent flash

  /* ---------- INITIALIZATION ---------- */
  useEffect(() => {
    // Set persistence once on app initialization
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("AuthContext: Persistence set to local");
      })
      .catch((err) => {
        console.error("AuthContext: Failed to set persistence", err);
      });
  }, []);

  /* ---------- AUTH STATE OBSERVER ---------- */
  useEffect(() => {
    console.log("AuthContext: Initializing state observer...");

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("AuthContext: State changed ->", firebaseUser ? "User exists" : "No user");

      if (!firebaseUser) {
        // Clear any old backend tokens just in case
        localStorage.removeItem("token");
        setUser(null);
        setProfile(null);
        setLoading(false); // Ready to render unauthenticated state
        return;
      }

      // Check domain restriction immediately (case-insensitive)
      if (firebaseUser.email && !firebaseUser.email.toLowerCase().endsWith("@gsv.ac.in")) {
        console.error("AuthContext: Unauthorized domain detected during session restoration");
        await firebaseSignOut(auth);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // SET BASIC USER IMMEDIATELY
      setUser({ ...firebaseUser, id: firebaseUser.uid });

      // Do NOT set loading to false yet. Wait for profile fetch.
      // fetch additional profile data from MongoDB
      try {
        const response = await api.getCurrentUser();
        if (response && response.user) {
          console.log("AuthContext: MongoDB profile fetch successful");
          const profileData = response.user;
          setProfile(profileData);
          setUser(prev => ({ ...prev, ...profileData, id: firebaseUser.uid }));
        }
      } catch (err) {
        console.error("AuthContext: MongoDB profile fetch failed ->", err);
        // Even if profile fetch fails, we have basic auth, so we should let them in.
      } finally {
        // NOW we are ready to show the UI
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  /* ---------- HELPER: SYNC PROFILE ---------- */
  // Removed syncProfile (Firestore) as we are now using MongoDB exclusively

  /* ---------- ACTIONS ---------- */

  const signUp = async ({ email, password, ...profileData }) => {
    // Strict domain check
    if (!email.toLowerCase().endsWith("@gsv.ac.in")) {
      throw new Error("Only university emails (@gsv.ac.in) are allowed.");
    }

    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);

    // Update Firebase profile with display name
    await updateProfile(newUser, { displayName: profileData.fullName });

    // Sync to MongoDB IMMEDIATELY
    try {
      const newProfileData = {
        ...profileData,
        email,
        firebaseUid: newUser.uid,
        role: profileData.role || "student"
      };

      await api.register(newProfileData);
      console.log("AuthContext: MongoDB registration successful");

      // OPTIMISTIC UPDATE
      setProfile(newProfileData);
      setUser(prev => ({ ...prev, ...newProfileData, id: newUser.uid }));
    } catch (err) {
      console.error("AuthContext: MongoDB registration failed", err);
      // We still proceed to verification, but log the error (and alert for visibility)
      console.warn(`Registration warning: Profile data sync failed (${err.message}). Self-healing will resolve this on next login.`);
      // Suppress alert as it confuses users and self-healing handles role assignment now
    }

    // Send verification email
    await sendEmailVerification(newUser);

    return newUser;
  };

  const signIn = async (email, password) => {
    // Firebase handles persistence automatically now
    const { user: existingUser } = await signInWithEmailAndPassword(auth, email, password);

    // Double check domain on sign-in (case-insensitive)
    if (existingUser.email && !existingUser.email.toLowerCase().endsWith("@gsv.ac.in")) {
      await firebaseSignOut(auth);
      throw new Error("Only @gsv.ac.in accounts are allowed.");
    }

    return existingUser;
  };

  const googleSignIn = async (role) => {
    const provider = new GoogleAuthProvider();
    // FIX: prompt: 'select_account' forces the account chooser every time
    provider.setCustomParameters({
      hd: "gsv.ac.in",
      prompt: "select_account"
    });

    const { user: gUser } = await signInWithPopup(auth, provider);

    if (!gUser.email?.toLowerCase().endsWith("@gsv.ac.in")) {
      await firebaseSignOut(auth);
      throw new Error("Only @gsv.ac.in Google accounts are allowed.");
    }

    // Sync to MongoDB
    try {
      await api.syncGoogle(role); // FIX: Pass role selection to backend
      // Fetch fresh profile after sync
      const response = await api.getCurrentUser();
      if (response && response.user) {
        setProfile(response.user);
        setUser(prev => ({ ...prev, ...response.user, id: gUser.uid }));
      }
    } catch (err) {
      console.error("AuthContext: MongoDB sync failed during Google sign-in", err);
    }

    return gUser;
  };

  const signOut = async () => {
    localStorage.removeItem("token");
    setProfile(null);
    setUser(null);
    await firebaseSignOut(auth);
  };

  const checkEmailVerification = async () => {
    if (!auth.currentUser) return false;
    await auth.currentUser.reload();
    if (auth.currentUser.emailVerified) {
      setUser(prev => prev ? { ...prev, emailVerified: true } : null);
      return true;
    }
    return false;
  };

  const resendVerificationEmail = async () => {
    if (!auth.currentUser) return;
    await sendEmailVerification(auth.currentUser);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateProfileData = async (updates) => {
    if (!user) return;

    // 1. OPTIMISTIC UPDATE: Update UI state immediately
    const previousProfile = profile;
    const previousUser = user;

    setProfile(prev => ({ ...prev, ...updates }));
    setUser(prev => ({ ...prev, ...updates }));

    try {
      // Direct MongoDB update
      console.log("AuthContext: Starting profile update...");
      const updatedUser = await api.updateProfile(updates);
      console.log("AuthContext: Profile update successful");

      // Update state with confirmed data from backend (optional, but safer)
      // setProfile(updatedUser); 
      // setUser(prev => ({ ...prev, ...updatedUser }));

      return updatedUser;
    } catch (err) {
      console.error("AuthContext: Profile update failed ->", err);
      // Revert optimistic update on failure
      setProfile(previousProfile);
      setUser(previousUser);
      throw err; // Propagate error to the component
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        googleSignIn,
        signOut,
        checkEmailVerification,
        resendVerificationEmail,
        resetPassword,
        updateProfile: updateProfileData
      }}
    >
      {/* Loading state handles session restoration block */}
      {children}
    </AuthContext.Provider>
  );
};
