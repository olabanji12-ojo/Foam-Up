// CallbackPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../utils/environments";
import { useAuth } from "../context/AuthContext";

const CallbackPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    fetch(`${baseURL}/user/callback/me`, { credentials: "include" }) // ⬅️ includes cookie
      .then(res => res.json())
      .then(data => {
        console.log("📡 /user/me response body:", data);

        if (data.success && data.data?.user) {
          const user = data.data.user;

          // ✅ save user in AuthContext & localStorage
          login(user, null); // no token needed because cookie is handling it

          // ✅ redirect based on role/account_type
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
        console.error("❌ Fetch /user/me failed:", err);
        navigate("/");
      });
  }, [navigate, login]);

  return <p>Loading... Redirecting...</p>;
};

export default CallbackPage;
