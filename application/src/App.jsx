import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { history } from "./_helpers";
import { Nav, Alert, PrivateRoute } from "./_components";
import { Home } from "./home";
import { AccountLayout } from "./account";
import { UsersLayout } from "./users";
import FileSharingApp from "./home/file_sharing/App";
import Healthcare_Database from "./home/healthcare_database/App"; // Import healthcare database

import "./App.scss";

export { App };

function App() {
  history.navigate = useNavigate();
  history.location = useLocation();

  return (
    <div className="app-container bg-light">
      <Nav />
      <Alert />
      <div className="container pt-4 pb-4">
        <Routes>
          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="users/*" element={<UsersLayout />} />
            <Route path="file-sharing" element={<FileSharingApp />} />
            <Route path="healthcare-database" element={<Healthcare_Database />} /> {/* Healthcare route */}
          </Route>

          {/* Public Routes */}
          <Route path="account/*" element={<AccountLayout />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
