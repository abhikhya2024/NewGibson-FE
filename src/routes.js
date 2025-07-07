/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import LoginPage from "components/Auth/LoginPage";

var routes = [
  // {
  //   path: "/index",
  //   name: "Home",
  //   icon: "ni ni-tv-2 text-primary",
  //   component: <Icons />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/icons",
  //   name: "Support",
  //   icon: "ni ni-planet text-blue",
  //   component: <Icons />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/maps",
  //   name: "Quick Start",
  //   icon: "ni ni-pin-3 text-orange",
  //   component: <Maps />,
  //   layout: "/admin",
  // },
  {
    path: "/user-profile",
    name: "Search All Testimony",
    icon: "ni ni-single-02 text-yellow",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Testimony by Topic",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Tables />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Transcripts",
    icon: "ni ni-key-25 text-info",
    component: <LoginPage />,
    layout: "/auth",
  },
  // {
  //   path: "/register",
  //   name: "Transcripts by Atty",
  //   icon: "ni ni-single-02 text-yellow",
  //   component: <Register />,
  //   layout: "/auth",
  // },
  // {
  //   path: "/register",
  //   name: "Topics by Witness",
  //   icon: "ni ni-circle-08 text-pink",
  //   component: <Register />,
  //   layout: "/auth",
  // },
  {
    path: "/register",
    name: "Topics",
    icon: "ni ni-pin-3 text-orange",
    component: <Register />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Topics by Frequency",
    icon: "ni ni-planet text-blue",
    component: <Register />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Word Cloud",
    icon: "ni ni-tv-2 text-primary",
    component: <Register />,
    layout: "/auth",
  },
];
export default routes;
