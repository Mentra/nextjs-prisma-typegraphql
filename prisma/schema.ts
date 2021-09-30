import { buildSchemaSync } from "type-graphql";
import CustomAuthResolver from "./resolvers/auth";
import { resolvers } from "./typegraphql/generated";

// Construct the Typegraphql Schema
const schema = buildSchemaSync({
  resolvers: [...resolvers, CustomAuthResolver]
});

export default schema;
