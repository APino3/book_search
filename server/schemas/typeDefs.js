const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
  }

  type Book {
    _id: ID
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    getSingleUser(id: ID!, username: String!): User
    getBooks(id: String!): User
  }

  input BookCreateInput {
    authors: [String]
    description: String
    image: String
    link: String
    title: String
  }

  type Mutation {
    login(email: String!, username: String!, password: String!): Auth
    createUser(username: String!, email: String!, password: String!): Auth
    saveBook(data: BookCreateInput!): User
    deleteBook(bookId: String!): [Book]
  }
`;

module.exports = typeDefs;
