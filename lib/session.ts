import jwt, { Secret } from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import Cookies from "cookies";
import { GraphQLContext } from "./types";

export const getSecret = (): Secret =>
  process.env.APP_SECRET ? process.env.APP_SECRET : "I'm a secret";

export const createSession = async ({
  context: { nextContext, prisma },
  user
}: {
  context: GraphQLContext;
  isImpersonation?: boolean;
  isScheduler?: boolean;
  user: User;
}): Promise<string> => {
  const cookies = new Cookies(nextContext.req, nextContext.res);

  const token = jwt.sign(
    {
      email: user.email,
      id: user.id
    },
    getSecret(),
    {
      expiresIn: "7d" // token will expire in 7 days
    }
  );

  await prisma.session.create({
    data: {
      token,
      userId: user.id
    }
  });

  cookies.set("token", `Bearer ${token}`, {
    // Expiration date for the cookie
    expires: new Date(Date.now() + 86400000),
    httpOnly: true,
    // Necessary to expose the cookie to the app AND api
    path: "/",
    // Google Cloud Run gives us an error when this is true :(
    secure: false
    // secure: process.env.NODE_ENV === "production"
  });

  return token;
};

export const encryptPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, 10);

export const killSessions = async ({
  prisma,
  token,
  userId
}: {
  prisma: PrismaClient;
  token?: string;
  userId: string;
}): Promise<number> => {
  // delete all existing sessions
  const { count: deletedSessions } = await prisma.session.deleteMany({
    where: {
      // If a token for this session is provided, search by it
      token,
      // Find all tokens by this user id
      userId
    }
  });
  console.log(`deleted ${deletedSessions} sessions of user ${userId}`);
  return deletedSessions;
};
