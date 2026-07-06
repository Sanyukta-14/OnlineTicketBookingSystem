import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Events from "../pages/Events";
import Bookings from "../pages/Bookings";
import Users from "../pages/Users";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
}

export default AppRoutes;