import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        events: [Event]
        bookings: [Booking]
    }

    input UserInput {
        username: String!
        email: String!
        password: String!
    }

    type AuthData {
        userId: ID!
        token: String!
        username: String!
    }

    type Event {
        id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creatorId: ID!
        creator: User!
        bookings: [Booking]
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    
    type Booking {
        id: ID! 
        eventId: ID!
        event: Event!
        userId: ID!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    type Query {
        events: [Event!]
        bookings: [Booking!]
        getUserEvents(userId: ID!): [Event]
        getIdEvents(eventId: ID!): Event
    }

    type Mutation {
        createUser(userInput: UserInput!): AuthData
        createEvent(eventInput: EventInput!): Event
        bookEvent(eventId: ID!): Booking
        cancelBooking(bookingId: ID!): Event
        login(email: String!, password: String!): AuthData
        deleteEvent(eventId: ID!): [Event!]
    }
    

`