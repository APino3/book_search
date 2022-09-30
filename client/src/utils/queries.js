import { gql } from "@apollo/client";

export const QUERY_BOOKS = gql`
  query GetBooks($username: String) {
    getBooks(username: $username) {
      _id
      username
      email
      password
      savedBooks {
        _id
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;

export const MUTATION_CREATE_USER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        username
        email
      }
    }
  }
`;

export const MUTATION_SAVE_BOOK = gql`
  mutation SaveBook(
    $authors: [String]!
    $description: String!
    $image: String!
    $link: String!
    $title: String!
  ) {
    saveBook(
      authors: $authors
      description: $description
      image: $image
      link: $link
      title: $title
    ) {
      _id
      username
      email
      password
      saveBooks {
        _id
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;
