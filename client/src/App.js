import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Button } from "antd";
import "./App.css";
import { GET_ALL_USERS, GET_ONE_USER } from "./query/user";
import { CREATE_USER } from "./mutations/user";

function App() {
  const [IDuser, setIDuser] = useState(1);
  const [user, setUser] = useState({ id: 0, username: "", age: 0 });
  const [users, setUsers] = useState([]);

  const [newUser] = useMutation(CREATE_USER);
  const { data, loading, error } = useQuery(GET_ALL_USERS);
  const {
    data: oneUser,
    loading: loadingOneUser,
    error: errorOneUser,
    refetch: refetchOneUser,
  } = useQuery(GET_ONE_USER, {
    variables: {
      id: IDuser,
    },
  });

  useEffect(() => {
    if (!loading && data) {
      const users = data.getAllUsers;
      setUsers(users);
    }
  }, [data, loading]);

  const onSubmit = (e) => {
    e.preventDefault();
  };
  const getOneUser = (e) => {
    if (!loadingOneUser) {
      setUser(oneUser);
    }
  };
  const addUser = (e) => {
    e.preventDefault();
    newUser({
      variables: {
        input: {
          username: user.username,
          age: +user.age,
        },
      },
    }).then((data) => console.log(data));
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <fieldset>
          <legend>Get user with ID</legend>
          <input type="number" min="1" value={IDuser} onChange={(e) => setIDuser(e.target.value)} />
          <Button type="secondary" onClick={getOneUser}>
            GET USER with id: {IDuser ? IDuser : "unknow"}
          </Button>
        </fieldset>

        <fieldset>
          <legend>Create new USER</legend>
          <div>
            <label>
              User name:
              <input
                value={user.username}
                name="username"
                onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })}
              />
            </label>
          </div>
          <div>
            <label>
              User age:
              <input
                type="number"
                value={user.age}
                name="age"
                onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })}
              />
            </label>
          </div>
          <button type="submit" className="dispay-block" onClick={addUser}>
            Create user
          </button>
        </fieldset>
      </form>

      <h2>{JSON.stringify(user)}</h2>

      <div>
        {users &&
          users.map((user) => {
            return (
              <div key={user.id}>
                {user.username}, age: {user.age}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
