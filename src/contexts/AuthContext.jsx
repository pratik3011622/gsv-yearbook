import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase.config";
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
  const [loading, setLoading] = useState(false);

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
        // Clear any old backend tokens just in case, though we shouldn't be using them
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
        return;
      }

      // Check domain restriction immediately (case-insensitive)
      if (firebaseUser.email && !firebaseUser.email.toLowerCase().endsWith("@gsv.ac.in")) {
        console.error("AuthContext: Unauthorized domain detected during session restoration");
        await firebaseSignOut(auth);
        setUser(null);
        setLoading(false);
        return;
      }

      // SET BASIC USER IMMEDIATELY -> This unlocks the UI instantlly
      setUser({ ...firebaseUser, id: firebaseUser.uid });
      setLoading(false);

      // Fetch additional profile data asynchronously in the background
      (async () => {
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(docRef);

          if (snap.exists()) {
            console.log("AuthContext: Background profile fetch successful");
            const profileData = snap.data();
            setProfile(profileData);
            setUser(prev => ({ ...prev, ...profileData, id: firebaseUser.uid }));
          }
        } catch (err) {
          console.error("AuthContext: Background profile fetch failed ->", err);
          // No need to clear user; they still have basic auth
        }
      })();
    });

    return () => unsubscribe();
  }, []);

  /* ---------- HELPER: SYNC PROFILE ---------- */
  const syncProfile = async (uid, data) => {
    try {
      await setDoc(doc(db, "users", uid), {
        ...data,
        uid,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.error("AuthContext: syncProfile failed ->", err);
    }
  };

  /* ---------- ACTIONS ---------- */

  const signUp = async ({ email, password, ...profileData }) => {
    // Strict domain check
    if (!email.toLowerCase().endsWith("@gsv.ac.in")) {
      throw new Error("Only university emails (@gsv.ac.in) are allowed.");
    }

    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);

    // Send verification email
    await sendEmailVerification(newUser);

    // Sync to Firestore
    try {
      await setDoc(doc(db, "users", newUser.uid), {
        ...profileData,
        email,
        uid: newUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isProfilePublic: true,
        role: profileData.role || "student"
      });
    } catch (err) {
      console.error("AuthContext: Firestore profile creation failed during signup", err);
    }

    // Sync to MongoDB -> REMOVED: This now happens in VerifyEmailPage after verification
    /* 
    try {
      await api.register({
        ...profileData,
        email,
        firebaseUid: newUser.uid,
        role: profileData.role || "student"
      });
    } catch (err) {
      console.error("AuthContext: MongoDB sync failed during signup", err);
    }
    */

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

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ hd: "gsv.ac.in" });

    const { user: gUser } = await signInWithPopup(auth, provider);

    if (!gUser.email?.toLowerCase().endsWith("@gsv.ac.in")) {
      await firebaseSignOut(auth);
      throw new Error("Only @gsv.ac.in Google accounts are allowed.");
    }

    // Sync to Firestore if profile doesn't exist
    const docRef = doc(db, "users", gUser.uid);
    try {
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        await setDoc(docRef, {
          uid: gUser.uid,
          email: gUser.email,
          fullName: gUser.displayName,
          avatarUrl: gUser.photoURL,
          role: "student",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isProfilePublic: true
        });
      }
    } catch (err) {
      console.error("AuthContext: Firestore sync failed during Google sign-in", err);
    }

    // Sync to MongoDB
    try {
      await api.syncGoogle();
    } catch (err) {
      console.error("AuthContext: MongoDB sync failed during Google sign-in", err);
    }

    return gUser;
  };

  const signOut = async () => {
    localStorage.removeItem("token");
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

  const updateProfileData = async (updates) => {
    if (!user) return;

    // 1. OPTIMISTIC UPDATE: Update UI state immediately
    const previousProfile = profile;
    const previousUser = user;

    setProfile(prev => ({ ...prev, ...updates }));
    setUser(prev => ({ ...prev, ...updates }));

    try {
      // 2. PARALLEL SYNC: Run Firestore and MongoDB updates concurrently
      console.log("AuthContext: Starting parallel profile sync...");
      const syncTasks = [
        syncProfile(user.uid, updates), // Firestore
        api.updateProfile(updates)      // MongoDB
      ];

      await Promise.all(syncTasks);
      console.log("AuthContext: Parallel profile sync successful");
    } catch (err) {
      console.error("AuthContext: Profile sync failed ->", err);
      // Optional: Revert on absolute failure if critical data is lost
      // For now, we keep the UI optimistic but log the error
      // alert("Some changes might not have synced. Please refresh.");
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
        updateProfile: updateProfileData
      }}
    >
      {/* Loading state handles session restoration block */}
      {children}
    </AuthContext.Provider>
  );
};
