const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type User {
    id: ID
    username: String
    age: Int
    posts: [Post]
  }

  type Post {
    id: ID
    title: String
    content: String
  }

  input UserInput {
    username: String!
    age: Int!
    Posts: [PostInput]
  }

  input PostInput {
    id: ID
    title: String!
    content: String!
  }

  type Query {
    getAllUsers: [User]
    getUser(id: ID): User
  }

  type Mutation {
    createUser(input: UserInput): User
  }
`);

module.exports = schema;
