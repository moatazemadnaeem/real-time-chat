import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import ErrorNotFoundPage from "./pages/error/errorNotFoundPage";
import SignUp from "./routes/signup";
import SignIn from "./routes/signin";
import Home from "./pages/home";
import ProtectRoute from "./routes/ProtectRoute";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<SignUp />} />
      <Route path="private" element={<ProtectRoute />}>
        <Route path="home" element={<Home />} />
      </Route>
      <Route path="signin" element={<SignIn />} />
      <Route path="*" element={<ErrorNotFoundPage />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

  <RouterProvider router={router} />

);
