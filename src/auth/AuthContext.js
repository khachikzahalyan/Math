import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as fbSignOut,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, isTeacherEmail } from '../firebase';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      if (u && !isTeacherEmail(u.email)) {
        try {
          await setDoc(
            doc(db, 'progress', u.uid),
            {
              email: u.email,
              displayName: u.displayName || '',
              photoURL: u.photoURL || '',
              lastActiveAt: serverTimestamp(),
            },
            { merge: true },
          );
        } catch (e) {
          // Молча игнорируем — rules могут ещё не быть опубликованы
        }
      }
    });
  }, []);

  const signIn = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
        return;
      }
      if (e?.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      // eslint-disable-next-line no-console
      console.error('[signIn] Firebase error:', e?.code, e?.message, e);
      throw e;
    }
  }, []);

  const signOut = useCallback(() => fbSignOut(auth), []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isTeacher: !!user && isTeacherEmail(user.email),
      signIn,
      signOut,
    }),
    [user, loading, signIn, signOut],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
