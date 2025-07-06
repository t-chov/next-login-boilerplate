import { createAuthClient } from "better-auth/react";

const getAuthClient = () => {
  return createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:13200",
  });
};

const authClient = getAuthClient();

export default authClient;
