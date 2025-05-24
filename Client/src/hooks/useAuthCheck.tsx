import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/apiService";

const useAuthCheck = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth");
        return;
      }

      try {
        const res = await api.validateToken();

        if (!res.data.valid) {
          localStorage.removeItem("token");
          navigate("/auth");
        }
      } catch (error) {
        console.error("Token check failed:", error);
        localStorage.removeItem("token");
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [navigate]);

  return loading;
};

export default useAuthCheck;
