import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../utils/environments";
import { useAuth } from "../context/AuthContext";

const CallbackPage = () => {
  const navigate = useNavigate();
  const { callbackLogin } = useAuth();

  useEffect(() => {
    fetch(`${baseURL}/user/callback/me`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📡 /user/callback/me response:", data);

        if (data.success && data.data?.token && data.data?.user) {
          const { token, user } = data.data;

          // ✅ store token + user in context/localStorage
          callbackLogin(token, user);

          // ✅ redirect based on role
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
          console.warn("❌ Not authenticated, redirecting to /");
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("❌ Fetch /user/callback/me failed:", err);
        navigate("/");
      });
  }, [navigate, callbackLogin]);

  return <p>Loading... Redirecting...</p>;
};

export default CallbackPage;
