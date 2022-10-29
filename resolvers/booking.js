import prisma from "lib/prisma";
import langs from "site-settings/site-translations";
import { UserInputError } from "apollo-server-micro";
import { transformEvent, transformBooking } from "helper/transform";
import { isLoggedin } from "middleware/isLoggedin";
import { combineResolvers } from "graphql-resolvers";

export const bookingResolver = {
  Query: {
    bookings: combineResolvers(isLoggedin, async (_, args, { user }) => {
      try {
        const bookings = await prisma.booking.findMany({
          where: { userId: user.id },
          include: { 
            event: true
          }
        });
        return bookings.map((booking) => transformBooking(booking));
      } catch (error) {
        throw error;
      }
    }),
  },
  Mutation: {
    bookEvent: combineResolvers(isLoggedin, async (_, args, { user }) => {
      try {
        const existing = await prisma.booking.findMany({
          where: {
            eventId: Number(args.eventId),
            userId: Number(user.id),
          },
        });
        if (existing.length > 0) throw new UserInputError(langs.ar.booking);
        const booking = await prisma.booking.create({
          data: {
            eventId: Number(args.eventId),
            userId: Number(user.id),
          },
        });
        return transformEvent(booking);
      } catch (error) {
        throw error;
      }
    }),
    cancelBooking: combineResolvers(
      isLoggedin,
      async (_, { bookingId }, { user }) => {
        try {
          const booking = await prisma.booking.findUnique({
            include: { event: true },
            where: { id: Number(bookingId) },
          });
          await prisma.booking.delete({ where: { id: Number(bookingId) } });
          return booking.event;
        } catch (error) {
          throw error;
        }
      }
    ),
  }
};
