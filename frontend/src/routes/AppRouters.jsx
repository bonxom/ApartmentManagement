import { Route } from "react-router-dom";
import SignIn from "../pages/public/SignIn";
import SignUp from "../pages/public/SignUp";
import ForgotPassword from "../pages/public/ForgotPassword";
import LandingPage from "../pages/public/LandingPage";
import ProtectedRoute from "../components/ProtectedRoute";

// Import role-based route components
import { memberRoutes } from "./userRoutes";
import { leaderRoutes } from "./leaderRoutes";
import { accountantRoutes } from "./accountantRoutes";

export const AppRouters = (
  <>
    {/* Public routes */}
    <Route path="/home" element={<LandingPage />} />
    <Route path="/" element={<LandingPage />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signin/leader" element={<SignIn />} />
    <Route path="/signin/accountant" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />

    {/* Protected routes for MEMBER */}
    <Route element={<ProtectedRoute allowedRoles={["MEMBER", "HOUSE MEMBER"]} />}>
      {memberRoutes}
    </Route>

    {/* Protected routes for HAMLET LEADER */}
    <Route element={<ProtectedRoute allowedRoles={["HAMLET LEADER"]} />}>
      {leaderRoutes}
    </Route>

    {/* Protected routes for ACCOUNTANT */}
    <Route element={<ProtectedRoute allowedRoles={["ACCOUNTANT"]} />}>
      {accountantRoutes}
    </Route>
  </>
);

export default AppRouters;
