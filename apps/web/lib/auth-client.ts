import { createAuthClient } from "better-auth/react";

const getAuthClient = () => {
  const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:13200";
  return createAuthClient({
    baseURL,
  });
};

const authClient = getAuthClient();

export const { signOut, useSession, signIn, signUp } = authClient;

export default authClient;
