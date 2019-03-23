var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
var { makeExecutableSchema } = require("graphql-tools");
var myData = [
  { name: "Ravinder Mahajan", age: 29 },
  { name: "Khushboo Mahajan", age: 28 },
  { name: "Raman Mahajan", age: 58 },
  { name: "Ruby Mahajan", age: 53 }
];

var typeDefs = [
  `
type Query {
  hello: String
  fetch: [Post!]!
}

type Post {
    name: String
    age: Int
}
schema {
  query: Query
}`
];

var resolvers = {
  Query: {
    hello(root) {
      return "world";
    },
    fetch(root, args) {
      return myData;
    }
  }
};

var schema = makeExecutableSchema({ typeDefs, resolvers });
var app = express();
app.use("/graphql", cors(), bodyParser.json(), graphqlExpress({ schema }));
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));
app.listen(4000, () => console.log("Now browse to localhost:4000/graphiql"));
