import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    OAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    TwitterAuthProvider,
    type UserCredential,
} from "firebase/auth";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const appleProvider = new OAuthProvider("apple.com");

// Maps Firebase's auth/* error codes to human-readable messages.
function toFriendlyMessage(code: string): string {
    switch (code) {
        case "auth/invalid-email":
            return "That email address looks invalid.";
        case "auth/user-disabled":
            return "This account has been disabled.";
        case "auth/user-not-found":
            return "No account found with that email.";
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "Incorrect email or password.";
        case "auth/email-already-in-use":
            return "An account with this email already exists.";
        case "auth/weak-password":
            return "Password is too weak. Use at least 8 characters.";
        case "auth/too-many-requests":
            return "Too many attempts. Please wait a moment and try again.";
        case "auth/network-request-failed":
            return "Network error. Check your connection and try again.";
        case "auth/popup-closed-by-user":
            return "Sign-in popup was closed before completing.";
        case "auth/cancelled-popup-request":
            return "Another sign-in popup is already open.";
        case "auth/account-exists-with-different-credential":
            return "An account already exists with this email using a different sign-in method.";
        case "auth/popup-blocked":
            return "Your browser blocked the sign-in popup. Please allow popups and try again.";
        default:
            return "Something went wrong. Please try again.";
    }
}

function getErrorCode(error: unknown): string {
    if (error && typeof error === "object" && "code" in error) {
        return String((error as { code: unknown }).code);
    }
    return "unknown";
}

export async function loginWithEmail(
    email: string,
    password: string
): Promise<{ user: UserCredential["user"] | null; error: string | null }> {
    try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        return { user: credential.user, error: null };
    } catch (error) {
        return { user: null, error: toFriendlyMessage(getErrorCode(error)) };
    }
}

export async function registerWithEmail(
    email: string,
    password: string
): Promise<{ user: UserCredential["user"] | null; error: string | null }> {
    try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        return { user: credential.user, error: null };
    } catch (error) {
        return { user: null, error: toFriendlyMessage(getErrorCode(error)) };
    }
}

export async function sendResetPasswordEmail(
    email: string
): Promise<{ success: boolean; error: string | null }> {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: toFriendlyMessage(getErrorCode(error)) };
    }
}

export async function signInWithGoogle(): Promise<{
    user: UserCredential["user"] | null;
    error: string | null;
}> {
    try {
        const credential = await signInWithPopup(auth, googleProvider);
        return { user: credential.user, error: null };
    } catch (error) {
        return { user: null, error: toFriendlyMessage(getErrorCode(error)) };
    }
}

export async function signInWithTwitter(): Promise<{
    user: UserCredential["user"] | null;
    error: string | null;
}> {
    try {
        const credential = await signInWithPopup(auth, twitterProvider);
        return { user: credential.user, error: null };
    } catch (error) {
        return { user: null, error: toFriendlyMessage(getErrorCode(error)) };
    }
}

export async function signInWithApple(): Promise<{
    user: UserCredential["user"] | null;
    error: string | null;
}> {
    try {
        appleProvider.addScope("email");
        appleProvider.addScope("name");
        const credential = await signInWithPopup(auth, appleProvider);
        return { user: credential.user, error: null };
    } catch (error) {
        return { user: null, error: toFriendlyMessage(getErrorCode(error)) };
    }
}

export async function logout(): Promise<{ error: string | null }> {
    try {
        await signOut(auth);
        return { error: null };
    } catch (error) {
        return { error: toFriendlyMessage(getErrorCode(error)) };
    }
}