import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "hooks/mutations";
import { useRouter } from "next/router";
import { AuthContext } from "contexts";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState()
  const { setToken, setUserName, setUserId } = useContext(AuthContext)
  const router = useRouter();
  
  const [login, { loading, data }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      document.cookie = `token = ${data.login.token};`;
      document.cookie = `userId = ${data.login.userId};`;
      document.cookie = `username = ${data.login.username};`;
      setToken(data.login.token);
      setUserName(data.login.username);
      setUserId(data.login.userId);
      router.push("/events");
    },
    onError: (error) => setAlert(error.message),
  });

  return (
    <React.Fragment>
      <h1>{alert}</h1>
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
          login({
            variables: {
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
