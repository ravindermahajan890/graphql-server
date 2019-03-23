var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
var { makeExecutableSchema } = require("graphql-tools");
var myData = [
  { name: "ravoider", age: 20 },
  { name: "ravoider", age: 21 },
  { name: "ravoider", age: 22 }
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
