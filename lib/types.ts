import { PrismaClient, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";

export type GraphQLContext = {
  nextContext: GetServerSidePropsContext;
  prisma: PrismaClient;
  token: string | null;
  user: Omit<User, "password"> | null;
};

export interface PublicRuntimeConfig {
  API_ENDPOINT: string;
  ENVIRONMENT: "DEV" | "PRODUCTION";
}
