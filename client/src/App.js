import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Button, Col, InputNumber, Row, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

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
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    return <Spin indicator={antIcon} />;
  }

  return (
    <div>
      <Row>
        <Col>
          <form onSubmit={onSubmit}>
            <fieldset>
              <legend>Search USER by ID</legend>
              <h2>{oneUser?.getUser?.username || "Not Found"}</h2>
              <InputNumber value={IDuser} onChange={(value) => setIDuser(+value)} />
            </fieldset>

            <fieldset>
              <legend>Create new USER</legend>
              <label>
                User name:
                <input
                  value={user.username}
                  name="username"
                  onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })}
                />
              </label>
              <label>
                User age:
                <input
                  type="number"
                  value={user.age}
                  name="age"
                  onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })}
                />
              </label>
              <Button type="primary" onClick={addUser}>
                Create user
              </Button>
            </fieldset>
          </form>
        </Col>
      </Row>

      <Row>
        <Col>
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
        </Col>
      </Row>
    </div>
  );
}

export default App;
