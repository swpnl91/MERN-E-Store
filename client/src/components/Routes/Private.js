import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";


export default function PrivateRoute() {
  
  const [ok, setOk] = useState(false);    // 'ok'/'setOk' because we send 'ok: true' in backend in 'authRoute.js'
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get("/api/v1/auth/user-auth");
      if (res.data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };

    if (auth?.token) authCheck();       // 'auth?.token' means - if 'auth' exists AND in that do we have 'auth.token'? Only then call 'authCheck()'.

  }, [auth?.token]);

  return ok ? <Outlet /> : '<Spinner />';    // '<Outlet />' is used for nested Routing (Can be seen in 'App.js')

}