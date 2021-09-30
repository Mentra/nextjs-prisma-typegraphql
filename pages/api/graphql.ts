import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse
} from "next";
import { ApolloServer } from "apollo-server-micro";
import getCurrentUserFromNextContext from "lib/get_user_from_next_context";
import { GraphQLContext } from "lib/types";
import prisma from "prisma/client";
import schema from "prisma/schema";

const apolloServer = new ApolloServer({
  context: async (
    context: GetServerSidePropsContext
  ): Promise<GraphQLContext> => {
    const results = await getCurrentUserFromNextContext({ context });

    return {
      nextContext: context,
      prisma,
      token: results?.token || null,
      user: results?.currentUser || null
    };
  },
  schema
});

const startServer = apolloServer.start();

const serverHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql"
  })(req, res);
};

export const config = {
  api: {
    bodyParser: false
  }
};

export default serverHandler;
