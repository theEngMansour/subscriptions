import prisma from "lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import langs from "site-settings/site-translations";
import { UserInputError } from "apollo-server-micro";


export const authResolver = {
  Mutation: {
    createUser: async (_, { userInput }) => {
      const { username, email, password } = userInput;
      try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing)
          throw new UserInputError(langs.ar.userInputError, {
            invalidArgs: email,
          });
        const hashed = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
          data: { username, email, password: hashed },
        });
        const userForToken = {
          email: user.email,
          id: user.id,
        };



        return {
          userId: user.id,
          token: jwt.sign(userForToken, process.env.JWT),
          username: user.username,
        };
      } catch (error) {
        throw error;
      }
    },
    login: async (_, { email, password }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new UserInputError(langs.ar.userInputErrorLogin);
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) throw new UserInputError(langs.ar.userInputErrorauth);
      const userForToken = {
        email: user.email,
        id: user.id,
      };
      return {
        userId: user.id,
        token: jwt.sign(userForToken, process.env.JWT),
        username: user.username,
      };
    },
  },

};
