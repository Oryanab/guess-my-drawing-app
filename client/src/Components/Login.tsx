import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { Notyf } from "notyf";

export default function Login() {
  const [userExist, setUserExist] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const notyf = new Notyf();

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
          .post("/api/login/new-user", {
            username: username,
          })
          .then((res) => {
            createCookie(res.data.key);
            notyf.success(res.data.message);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          })
          .catch(() =>
            notyf.error(
              "username is exist in our database please enter your secret key or sign up with new one"
            )
          );
        break;
      case true:
        axios
          .post("/api/login/get-user", {
            username: username,
            key: secretKey,
          })
          .then((res) => {
            createCookie(res.data.key);
            notyf.success(res.data.message);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          })
          .catch((err) => notyf.error(err.message));
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
              onChange={(e) => setUsername(e.target.value.trim())}
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
              onChange={(e) => setSecretKey(e.target.value.trim())}
              type="text"
              placeholder="my secret key..."
            />
          </Form.Group>
          <Button onClick={(e) => handleSubmit(e)} variant="outline-primary">
            Login
          </Button>
        </Form>
      </div>
      <div className="personal-info">
        <b>Proudly create by Oryan Abergel</b>
        <br />
        <br />
        <div className="personal-links">
          <a
            href="https://github.com/Oryanab/guess-my-drawing-app"
            target="_blank"
          >
            <Button variant="dark">GitHub</Button>
          </a>
          <a href="https://www.linkedin.com/in/oryan-abergel/" target="_blank">
            <Button variant="primary">LinkedIn</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
