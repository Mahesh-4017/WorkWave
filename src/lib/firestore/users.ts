import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserProfile, UserRole } from "./types";

const usersCol = "users";

/**
 * Call once right after registration (email/password or any OAuth provider).
 * Uses the Auth uid as the doc id, and setDoc with merge so re-running it
 * (e.g. a returning OAuth user) never clobbers existing fields.
 */
export async function createUserProfile(params: {
  uid: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  role?: UserRole;
}): Promise<void> {
  const ref = doc(db, usersCol, params.uid);
  const existing = await getDoc(ref);

  if (existing.exists()) return; // profile already created, don't overwrite role/etc.

  await setDoc(ref, {
    uid: params.uid,
    email: params.email,
    displayName: params.displayName ?? null,
    photoURL: params.photoURL ?? null,
    role: params.role ?? "jobseeker",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastSignInAt: serverTimestamp(),
    lastSignOutAt: null,
  });
}

/** Call on every successful sign-in (not just first-time registration). */
export async function recordSignIn(uid: string): Promise<void> {
  await updateDoc(doc(db, usersCol, uid), { lastSignInAt: serverTimestamp() });
}

/** Call right before signOut() so the timestamp is written while the user is still authenticated. */
export async function recordSignOut(uid: string): Promise<void> {
  await updateDoc(doc(db, usersCol, uid), { lastSignOutAt: serverTimestamp() });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, usersCol, uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<Pick<UserProfile, "displayName" | "photoURL" | "role">>
): Promise<void> {
  await updateDoc(doc(db, usersCol, uid), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}
