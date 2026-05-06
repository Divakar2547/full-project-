import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Contact from "./Pages/Contact";
import BookNow from "./Pages/BookNow";
import BookingConfirm from "./Pages/BookingConfirm";
import About from "./Pages/About";
import Services from "./Pages/Services";
import Product from "./Pages/Product";
import Dashboard from "./Pages/Dashboard";

const routerVariables = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path:"/Login",
        element:<Login></Login>
      },
      {
        path:"/Register",
        element:<Register></Register>
      },
      {
        path:"/Contact",
        element:<Contact></Contact>
      },
      {
        path:"/BookNow",
        element:<BookNow></BookNow>
      },
      {
        path:"/BookingConfirm",
        element:<BookingConfirm></BookingConfirm>
      },
      {
        path:"/About",
        element:<About></About>
      },
      {
        path:"/Services",
        element:<Services></Services>
      },
      {
        path:"/Product",
        element:<Product></Product>
      },
      {
        path:"/Dashboard",
        element:<Dashboard></Dashboard>
      },
      {
        path: "*",
        element: <h1>Page not found Please Check your url</h1>,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={routerVariables}></RouterProvider>
  </React.StrictMode>
);

reportWebVitals();