import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Button, InputNumber } from "antd";
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
  const getUserByID = (e) => {
    refetchOneUser();
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
    }).then(({ data }) => {
      const { id, username, age } = data.createUser;
      setUsers([...users, { id, username, age }]);
    });
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="flex">
          <fieldset>
            <legend>Search USER by ID</legend>
            <h2>{oneUser?.getUser?.username || "Not Found"}</h2>
            <InputNumber value={IDuser} onChange={(value) => setIDuser(+value)} />
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
            <Button type="primary" onClick={addUser}>
              Create user
            </Button>
          </fieldset>
        </div>
      </form>

      <div>
        {users &&
          users.map((user) => {
            return (
              <div key={user.id}>
                {user.username}, age: {user.age}, ID: {user.id}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
