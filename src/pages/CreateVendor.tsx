import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateVendor() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/vendors");
  }, [navigate]);

  return null;
}