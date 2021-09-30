import { Session, User } from "@prisma/client";
import Cookies from "cookies";
import { getSecret } from "./session";
import { GetServerSidePropsContext } from "next";
import jwt from "jsonwebtoken";
import prisma from "prisma/client";

async function getCurrentUserFromNextContext({
  context
}: {
  context: GetServerSidePropsContext;
}): Promise<{
  currentUser: Omit<User, "password"> | null;
  token: string | null;
}> {
  const cookies = new Cookies(context.req, context.res);

  if (!cookies) {
    return { currentUser: null, token: null };
  }

  const tokenWithBearer = cookies.get("token");

  if (!tokenWithBearer) {
    return { currentUser: null, token: null };
  }

  const [, token] = tokenWithBearer.split("Bearer ");

  if (token) {
    const sessions = await prisma.session.findMany({
      where: {
        token
      }
    });

    // If no sessions could be found, this user has not been logged in
    if (!sessions?.length) {
      return { currentUser: null, token: null };
    }

    // Verify the JWT that comes from the user's token
    const payload = jwt.verify(token, getSecret()) as {
      id?: string;
    };

    // Find the corresponding session
    const session = sessions.find(
      (session: Session) => session.userId === payload.id
    );

    // If there is a token, but no session could be found,
    // a JWT collision occurred
    if (!session) {
      console.error("JWT collision occured!");
      return { currentUser: null, token: null };
    }
    const user = await prisma.user.findUnique({
      select: {
        createdAt: true,
        email: true,
        id: true,
        lastModified: true,
        name: true,
        password: false
      },
      where: {
        id: session.userId
      }
    });

    return { currentUser: user, token };
  }

  return { currentUser: null, token: null };
}

export default getCurrentUserFromNextContext;
