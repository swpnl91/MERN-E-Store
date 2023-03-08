import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";


export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();
}