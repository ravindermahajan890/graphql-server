var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var mongoose = require("mongoose");
var { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
var { makeExecutableSchema } = require("graphql-tools");
var myData = [
  { name: "Ravinder Mahajan", age: 29 },
  { name: "Khushboo Mahajan", age: 28 },
  { name: "Yedhant Gupta", age: 30 },
  { name: "Raman Mahajan", age: 58 },
  { name: "Ruby Mahajan", age: 53 }
];

mongoose.connect(
  "mongodb+srv://ravs890:Khubu890@cluster0-zbt5x.mongodb.net/test?retryWrites=true"
);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("connected");
});

var todoSchema = new mongoose.Schema({
  name: String,
  age: Number
});
var Todo = mongoose.model("todo", todoSchema);
// var data1 = new Todo({ name: "Ravinder Mahajan", age: 29 });
// var data2 = new Todo({ name: "Khushboo Mahajan", age: 28 });
// var data3 = new Todo({ name: "Yedhant Gupta", age: 30 });
// var data4 = new Todo({ name: "Raman Mahajan", age: 58 });
// var data5 = new Todo({ name: "Ruby Mahajan", age: 53 });

// Todo.insertMany([data1, data2, data3, data4, data5], function(er, data) {
//   console.log(data);
// });

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
    async fetch(root, args) {
      var fetchData = await Todo.find(function(e, data) {
        return data;
      });
      return fetchData;
    }
  }
};

var schema = makeExecutableSchema({ typeDefs, resolvers });
var app = express();
app.use("/graphql", cors(), bodyParser.json(), graphqlExpress({ schema }));
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));
app.listen(4000, () => console.log("Now browse to localhost:4000/graphiql"));
