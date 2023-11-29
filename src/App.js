import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
// import Waiting from "./pages/waiting/Waiting";

import {
  createBrowserRouter,
  RouterProvider,
  // Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import MyProfile from "./pages/myprofile/MyProfile";
import MyPets from "./pages/MyPets/MyPets";
import MarketPlace from "./pages/MarketPlace/MarketPlace";
import Admin from "./Admin";
// import User from "./User";

import "./style.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import ForgotPassword from "./pages/password/ForgotPassword";
import ResetPassword from "./pages/password/ResetPassword";
import StaffProfile from "./pages/staff/Staff";
import Payment from "./components/payment/Payment";
import Chat from "./pages/messenger/Messenger";
import Applied from "./pages/appliedpage/Applied";
import SearchResults from "./components/search/Search";

function App() {
  // Empty dependency array ensures this effect runs only once when the component mounts

  const { currentUser } = useContext(AuthContext);

  const { darkMode } = useContext(DarkModeContext);
  // if(crUser==null){
  //   return <Navigate to ="/login"/> ;
  // };
  const Layout = () => {
    return (
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <LeftBar />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
          <RightBar />
        </div>
      </div>
    );
  };

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return <Navigate to="/login" />;
    }
    const crUser = JSON.parse(localStorage.getItem("currentUser"));
    if (crUser.role === "ROLE_ADMIN") {
      return <Navigate to="/admin" />;
    }

    return children;
  };

  <Route path="/profile/:userID" component={Profile} />;

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:userID",
          element: <Profile />,
        },
        {
          path: "/my-profile",
          element: <MyProfile />,
        },
        {
          path: "/my-pets",
          element: <MyPets />,
        },
        {
          path: "/market-place",
          element: <MarketPlace />,
        },
        {
          path: "/payment/*",
          element: <Payment />,
        },
        {
          path: "/view-apply",
          element: <Applied />,
        },
        {
          path: "/search",
          element: <SearchResults />,
        },
        {
          path: "/staff/*",
          element: <StaffProfile />,
        },
      ],
    },

    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      path: "/chat",
      element: <Chat />,
    },

    {
      path: "/admin/*",
      element: <Admin />,
    },

    // {
    //   path:"/waiting",
    //   element:<Waiting/>
    // },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
