import { AuthenticationError } from "apollo-server-micro";

export const authenticationError = (reason?: string): AuthenticationError =>
  new AuthenticationError(
    reason
      ? `Authentication failed! reason: ${reason}`
      : "Authentication failed!"
  );
