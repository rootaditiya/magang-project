import { useState } from "react";

export default function useToken() {
  const getUser = () => {
    const userData = sessionStorage.getItem("token");
    const user = JSON.parse(userData);
    return user;
  };
  const [auth, setAuth] = useState(getUser());

  const saveUser = user => {
    sessionStorage.setItem('user', JSON.stringify(user));
    setAuth(user);
  }

  return {
    setUser: saveUser,
    auth
  }
}
