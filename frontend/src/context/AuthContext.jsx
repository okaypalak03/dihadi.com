import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/auth/me", {
          headers: { "x-auth-token": token },
        })
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password }
    );
    localStorage.setItem("token", data.token);

    const me = await axios.get("http://localhost:5000/api/auth/me", {
      headers: { "x-auth-token": data.token },
    });
    setUser(me.data);
  };

  const register = async (userData) => {
    const { data } = await axios.post(
      "http://localhost:5000/api/auth/register",
      userData
    );
    localStorage.setItem("token", data.token);

    const me = await axios.get("http://localhost:5000/api/auth/me", {
      headers: { "x-auth-token": data.token },
    });
    setUser(me.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
