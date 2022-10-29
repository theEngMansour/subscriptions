import prisma from "lib/prisma";
import micro_cors from "micro-cors";
import jwt from "jsonwebtoken";
import { ApolloServer } from "apollo-server-micro";
import { typeDefs } from "schema";
import { resolvers } from "resolvers";

const cors = micro_cors({
  origin: "https://studio.apollographql.com",
  allowMethods: ["GET", "POST"],
});

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth) {
      const decoded = jwt.verify(auth, process.env.JWT);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      return { user };
    }
  },
});

const startServer = apolloServer.start();

export default cors(async function handler(req, res) {
  if (req.method == "OPTIONS") {
    res.end();
    return false;
  }
  await startServer;
  await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
});

export const config = {
  api: {
    bodyParser: false,
  },
};
