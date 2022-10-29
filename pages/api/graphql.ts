import prisma from "lib/prisma";
import micro_cors from "micro-cors";
import jwt from "jsonwebtoken";
import { ApolloServer } from 'apollo-server-micro'
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer } from 'graphql-ws/lib/use/ws';
import { Disposable } from 'graphql-ws';
import { WebSocketServer } from 'ws';
import { typeDefs } from "schema";
import { resolvers } from "resolvers";

const schema = makeExecutableSchema({ typeDefs, resolvers });

const cors = micro_cors({
  origin: "https://studio.apollographql.com",
  allowMethods: ["GET", "POST"],
});

let serverCleanup: Disposable | null = null;

const apolloServer = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup?.dispose();
          },
        };
      },
    },
  ],
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth) {
      const decoded: string | any = jwt.verify(auth, process.env.JWT);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      return { user };
    }
  },
});

const startServer = apolloServer.start()

const wsServer = new WebSocketServer({
  noServer: true
});

export default cors(async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }

  res.socket.server.ws ||= (() => {
    res.socket.server.on('upgrade', function (request, socket, head) {
      wsServer.handleUpgrade(request, socket, head, function (ws) {
        wsServer.emit('connection', ws);
      })
    })
    serverCleanup = useServer({ schema }, wsServer);
    return wsServer;
  })();

  await startServer;
  await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
})

export const config = {
  api: {
    bodyParser: false,
  },
}