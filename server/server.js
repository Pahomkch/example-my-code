require("dotenv").config();
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");
const schema = require("./schema");

const dbInFuture = [
  {
    id: 1,
    username: "Andrew",
    age: 27,
    posts: [
      {
        id: 100,
        title: "Hello",
        content: "Text Post",
      },
    ],
  },
  {
    id: 2,
    username: "Esia",
    age: 4,
  },
];

const app = express();
app.use(cors());

const root = {
  getAllUsers: () => dbInFuture,
  getUser: (data) => dbInFuture.find((user) => user.id == data.id),
  createUser: ({ input }) => {
    const user = {
      id: Date.now(),
      username: input.username,
      age: input.age,
    };
    dbInFuture.push(user);
    return user;
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(process.env.PORT, () => {
  console.log("server is run on port" + process.env.PORT);
});
