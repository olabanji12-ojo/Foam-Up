import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { baseURL } from "../utils/environments";

function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) { 
      // Save token immediately
      localStorage.setItem("token", token);

      console.log("Saved token:", localStorage.getItem("token"));

      // Fetch user details
      fetch(`${baseURL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json()) 
        .then(data => {
          // Save user AFTER backend responds
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("Saved user:", localStorage.getItem("user"));

          // Update AuthContext
          login(data.user, token);

          // Redirect to home
          navigate("/");
        })
        .catch(err => {
          console.error("Error fetching user:", err);
          navigate("/login");
        });
    }
  }, [navigate, login]);

  return <p>Signing you in...</p>;
}

export default AuthCallback;
