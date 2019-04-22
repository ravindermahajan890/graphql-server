var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var mongoose = require("mongoose");
var { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
var { makeExecutableSchema } = require("graphql-tools");
mongoose.connect(
  "mongodb+srv://ravs890:Khubu890@cluster0-zbt5x.mongodb.net/test?retryWrites=true"
);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("connected");
});

var todoSchema = new mongoose.Schema({
  task: String,
  detail: String,
  taskId: String,
  pending: Boolean
});
var Todo = mongoose.model("todo", todoSchema);

var typeDefs = [
  `
type Query {
  hello: String
  fetch: [Post!]!
}

type Mutation {
  post(task: String!, detail: String!, taskId: String, pending: Boolean): [Post!]
  delete(taskId: String!):Post!
  undo(taskId: String!):Post!
}

type Post {
    task: String
    detail: String
    taskId: String
    pending: Boolean
}
schema {
  query: Query,
  mutation: Mutation
}`
];

var resolvers = {
  Query: {
    hello(root) {
      return "world....";
    },
    async fetch(root, args) {
      var fetchData = await Todo.find().sort({ pending: -1 });
      return fetchData;
    }
  },
  Mutation: {
    post(root, args) {
      var dataToSave = new Todo({
        task: args.task,
        detail: args.detail,
        taskId: Math.random()
          .toString(36)
          .substring(2),
        pending: true
      });
      var entries = Todo.insertMany([dataToSave]).then(function(data) {
        return data;
      });
      return entries;
    },
    async delete(root, args) {
      await Todo.updateOne({ taskId: args.taskId }, { pending: false });
      var fetchData = await Todo.findOne({ taskId: args.taskId });
      return fetchData;
    },
    async undo(root, args) {
      await Todo.updateOne({ taskId: args.taskId }, { pending: true });
      var fetchData = await Todo.findOne({ taskId: args.taskId });
      return fetchData;
    }
  }
};

var schema = makeExecutableSchema({ typeDefs, resolvers });
var app = express();
app.use("/graphql", cors(), bodyParser.json(), graphqlExpress({ schema }));
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));
app.listen(4000, () => console.log("Now browse to localhost:4000/graphiql"));
