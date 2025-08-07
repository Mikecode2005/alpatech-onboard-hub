// This file is deprecated - redirects to appropriate login pages
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/trainee-login");
  }, [navigate]);

  return null;
};

export default Login;