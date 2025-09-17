// CallbackPage.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, callbackLogin } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      console.warn("❌ No token found in URL, redirecting home");
      navigate("/");
      return;
    }

    // Save token and load user info from backend
    localStorage.setItem("token", token);

    // Call your backend to fetch user details using the token
    fetch("https://car-wash-app-j54r.onrender.com/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.user) {
          const user = data.data.user;

          // Save in AuthContext
          callbackLogin(token, user);

          // Redirect based on role
          if (user.account_type === "car_owner" && user.role === "car_owner") {
            navigate("/Customer_dashboard");
          } else if (
            user.account_type === "car_wash" &&
            user.role === "business_owner"
          ) {
            navigate(`/Car_wash_dashboard/${user.id}`);
          } else {
            navigate("/");
          }
        } else {
          console.warn("❌ Failed to fetch user, redirecting home");
          navigate("/");
        }
      })
      .catch(err => {
        console.error("❌ Fetch user failed:", err);
        navigate("/");
      });
  }, [navigate, location, callbackLogin]);

  return <p>Loading... Redirecting...</p>;
};

export default CallbackPage;
