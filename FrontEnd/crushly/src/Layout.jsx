import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "./features/authActions";

export default function Layout() {

    const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch])

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
