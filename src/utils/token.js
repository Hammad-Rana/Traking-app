import { useEffect, useState } from "react";

export const TOKEN_KEY = "CognitoIdentityServiceProvider..LastAuthUser";

export const getToken = () => {
  const item = localStorage.getItem(TOKEN_KEY);
  return item;
};

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const useRole = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return role;
};
