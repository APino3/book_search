const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const path = require("path");
const db = require("./config/connection");
const resolvers = require("./schemas/resolvers");
const typeDefs = require("./schemas/typeDefs");

const jwt = require("jsonwebtoken");

// set token secret and expiration date
const secret = "mysecretssshhhh";
const expiration = "2h";

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: ({ req }) => {
    //allows token to be sent via req.query or headers
    let token = req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      console.log("returning null");
      return null;
      //return res.status(400).json({ message: 'You have no token!'});
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      console.log("FOUND USER within the context!", data);
      return data;
    } catch {
      console.log("Invalid token");
      return null;
      //return res.status(400).json({ message: 'You have no token!'});
    }
  },
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
