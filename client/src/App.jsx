import React, { useEffect } from "react";
import AppRoutes from "./routes";
import { useDispatch } from "react-redux";
import { getUserInfoAsync } from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const result = await dispatch(getUserInfoAsync()).unwrap();
        // console.log(result);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserInfo();
  }, []);

  return <AppRoutes />;
}

export default App;
