import { gql } from "@apollo/client";

export const EVENTS = gql`
  query Events {
    events {
      id
      title
      price
      date
      creatorId
    }
  }
`;

export const GET_EVENT = gql`
  query GetIdEvents($eventId: ID!) {
    getIdEvents(eventId: $eventId) {
      id
      title
      description
      price
      date
      creatorId
      creator {
        username
      }
    }
  }
`;

export const BOOKINGS = gql`
  query Bookings {
    bookings {
      id
      createdAt
      event {
        id
        title
        price
        date
      }
    }
  }
`;
