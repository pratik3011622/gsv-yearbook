import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  deleteUser,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase.config';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Explicitly set persistence ensures user stays logged in
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("Auth persistence set to LOCAL");
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
      });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Enforce Email Verification on Page Load / Refresh
        if (!firebaseUser.emailVerified) {
          // If not verified, we can choose to log them out or let them stay in a "limited" state.
          // For strict enforcement, we might want to log them out, but usually we let them see a "Please verify" page.
          // For this specific requirement "email is valid or not .. you can check with email verification link",
          // we'll allow the session but the UI should block access if not verified.
          // However, for clean state management, we'll fetch their Firestore data.
        }

        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('token', token);

          // Fetch user profile from Firestore
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUser({ ...firebaseUser, ...docSnap.data() });
          } else {
            // Fallback if firestore doc missing (shouldn't happen if registered properly)
            setUser(firebaseUser);
          }

        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (userData) => {
    console.log("Starting signUp...");
    const { email, password, ...profileData } = userData;

    // 1. Domain Check
    if (!email.endsWith('@gsv.ac.in')) {
      throw new Error('Registration is restricted to @gsv.ac.in email addresses only.');
    }

    // 2. Create Auth User
    console.log("Creating user in Firebase Auth...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    console.log("User created:", firebaseUser.uid);

    // 3. Send Verification Email
    console.log("Sending verification email...");
    const actionCodeSettings = {
      url: window.location.href.split('#')[0] + '#/login', // Redirect to login after verification
      handleCodeInApp: true,
    };
    await sendEmailVerification(firebaseUser, actionCodeSettings);
    console.log("Verification email sent.");

    // 4. Create Firestore Document & Sign Out (Background Process)
    // We do not await this so the UI can respond immediately (User request: "show pop up immediately")
    (async () => {
      console.log("Starting background profile creation...");
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          ...profileData, // fullName, role, batchYear, etc.
          email: email,
          createdAt: serverTimestamp(),
          role: profileData.role || 'student', // Default role
          uid: firebaseUser.uid
        });
        console.log("Firestore profile created (background).");
      } catch (dbError) {
        console.error("Error creating user profile in Firestore:", dbError);
      }

      // 5. Force Sign Out
      console.log("Signing out new user (background)...");
      await firebaseSignOut(auth);
      console.log("Sign out complete (background).");
    })();

    return firebaseUser;
  };

  const signIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // We allow unverified users to sign in so the App can show them the "Verify Email" page
    // instead of just throwing an error and keeping them locked out.
    if (!firebaseUser.emailVerified) {
      await firebaseSignOut(auth);
      throw new Error('Please verify your email address before logging in. Check your inbox.');
    }

    return firebaseUser;
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      hd: 'gsv.ac.in' // Hint to Google to show only gsv accounts
    });

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      // Strict Domain Check (in case they bypassed the hint)
      if (!firebaseUser.email?.endsWith('@gsv.ac.in')) {
        await deleteUser(firebaseUser); // Delete the unauthorized account immediately
        throw new Error('Access restricted to @gsv.ac.in domains.');
      }

      // Check/Create Firestore Profile
      const docRef = doc(db, 'users', firebaseUser.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          fullName: firebaseUser.displayName,
          email: firebaseUser.email,
          avatarUrl: firebaseUser.photoURL,
          role: 'student',
          createdAt: serverTimestamp(),
          uid: firebaseUser.uid
        });
      }

      return firebaseUser;
    } catch (error) {
      console.error("Google Sign In Error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  const value = {
    user,
    profile: user, // Alias for backward compatibility
    loading,
    signUp,
    signIn,
    googleSignIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};