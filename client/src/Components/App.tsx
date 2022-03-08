import React, { useEffect, useState } from "react";
import Login from "./Login";
import HomePage from "./HomePage";
import axios from "axios";
import { Users } from "../types";

function App() {
  const [isCookie, setIsCookie] = useState<string>("");
  const [user, setUser] = useState<Users>();
  const [confirmUserToken, setConfirmUserToken] = useState<boolean>(false);

  function getCookie(cookieName: string) {
    const cookies = `${document.cookie}`.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].split("=");
      if (cookie[0] == `${cookieName}`) {
        setIsCookie(cookie[1]);
        return;
      }
    }
    setIsCookie("");
    setConfirmUserToken(false);
    return;
  }

  const confirmUser = (key: string) => {
    axios
      .post("http://localhost:4000/api/login/single-user", {
        key: isCookie,
      })
      .then((res) => {
        if (res.data.message) {
          setConfirmUserToken(res.data.confirm);
          setUser(res.data.message);
        }
      });
  };

  useEffect(() => {
    getCookie("user_key");
    confirmUser(isCookie);
  }, [isCookie]);

  return (
    <div className="app">
      {confirmUserToken === true ? <HomePage user={user!} /> : <Login />}
    </div>
  );
}

export default App;
