import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      userId
      username
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(userInput: {username:$username, email: $email, password: $password}) {
      token
      userId
      username
    }
  }
`;

export const BOOK_EVENT = gql`
  mutation BookEvent($eventId: ID!) {
    bookEvent(eventId: $eventId) {
      id
      createdAt
      updatedAt
    }
  }
`

export const CREATE_EVENT = gql`
  mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
    createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
      id
      title
      description
      price
      date
    }
  }
`

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($bookingId: ID!){
    cancelBooking(bookingId: $bookingId) {
      id
      title
    }
  }
` 