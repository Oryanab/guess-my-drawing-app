import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

export default function Login() {
  const [userExist, setUserExist] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");

  const createCookie = (value: string) => {
    const currentTimePlusHour = new Date(
      new Date().setHours(new Date().getHours() + 48)
    );
    document.cookie = `user_key=${value}; expires=${currentTimePlusHour}`;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    switch (userExist) {
      case false:
        axios
          .post("http://localhost:4000/api/login/new-user", {
            username: username,
          })
          .then((res) => {
            createCookie(res.data.key);
            alert(res.data.message);
            window.location.reload();
          })
          .catch((err) => console.log(err));
        break;
      case true:
        axios
          .post("http://localhost:4000/api/login/get-user", {
            username: username,
            key: secretKey,
          })
          .then((res) => {
            createCookie(res.data.key);
            alert(res.data.message);
            window.location.reload();
          })
          .catch((err) => console.log(err));
        break;
      default:
        return;
    }
  };
  return (
    <div className="login-parent">
      <h1 className="login-title">
        <b> Guess My Drawing</b>
      </h1>

      <div className="login">
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Enter Your Username:</Form.Label>
            <Form.Control
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="my username..."
            />
            <Form.Check
              type="switch"
              id="custom-switch"
              label="This user exists"
              onChange={(e) => {
                !userExist ? setUserExist(true) : setUserExist(false);
              }}
            />
          </Form.Group>
          <Form.Group
            style={{ display: userExist ? "block" : "none" }}
            className="mb-3"
            controlId="exampleForm.ControlTextarea1"
          >
            <Form.Label>Enter Your Secret Key:</Form.Label>
            <Form.Control
              onChange={(e) => setSecretKey(e.target.value)}
              type="text"
              placeholder="my secret key..."
            />
          </Form.Group>
          <Button onClick={(e) => handleSubmit(e)} variant="outline-primary">
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
}
