import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "hooks/mutations";
import { useRouter } from "next/router";
import { AuthContext } from "contexts";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState()
  const { setToken, setUserName, setUserId } = useContext(AuthContext)
  const router = useRouter();

  const [register, { loading, data }] = useMutation(CREATE_USER, {
    onCompleted: (data) => {
      document.cookie = `token = ${data.createUser.token};`;
      document.cookie = `userId = ${data.createUser.userId};`;
      document.cookie = `username = ${data.createUser.username};`;
      setToken(data.createUser.token);
      setUserName(data.createUser.username);
      setUserId(data.createUser.userId);
      router.push("/events");
    },
    onError: (error) => setAlert(error.message),
  });

  return (
    <React.Fragment>
      <h1>{alert}</h1>
      <input
        type="text"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
        required
      />
      <input
        type="email"
        value={email}
        onChange={({ target }) => setEmail(target.value)}
        required
      />
      <input
        type="password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
        required
      />
      <button
        onClick={() =>
          register({
            variables: {
              username: username.trim(),
              email: email.trim(),
              password: password.trim(),
            },
          })
        }
      >
        إرسال
      </button>
    </React.Fragment>
  );
}
