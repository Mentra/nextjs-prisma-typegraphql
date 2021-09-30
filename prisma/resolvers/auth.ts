import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { createSession, killSessions } from "lib/session";
import { authenticationError } from "lib/errors";
import bcrypt from "bcrypt";
import Cookies from "cookies";
import { GraphQLContext } from "lib/types";
import { User } from "prisma/typegraphql/generated/models/User";

@Resolver(User)
class CustomAuthResolver {
  @Mutation(() => User, { nullable: false })
  async login(
    @Arg("email", { nullable: false }) email: string,
    @Arg("password", { nullable: false }) password: string,
    @Ctx() context: GraphQLContext
  ): Promise<User> {
    const { prisma } = context;
    // try to fetch the user from db
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // complain if it doesn't exist
    if (!user) {
      throw authenticationError("Invalid login!");
    }

    // compare the passwords using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    // complain if they don't match
    if (!passwordMatch) {
      throw authenticationError("Invalid login!");
    }

    // create the session and attach it to the request's GraphQL context
    await createSession({
      context,
      user
    });

    return user;
  }

  @Mutation(() => Number, { nullable: false })
  async logout(
    @Ctx() { prisma, nextContext, user }: GraphQLContext
  ): Promise<number | null> {
    const cookies = new Cookies(nextContext.req, nextContext.res);
    cookies.set("token");
    if (user) {
      return await killSessions({
        prisma,
        userId: user.id
      });
    } else {
      return 0;
    }
  }
}

export default CustomAuthResolver;
