import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="font-bold">HRMS</div>
        <div className="space-x-4">
          {token ? (
            <>
              <Link to="/employees" className="text-sm">
                Employees
              </Link>
              <Link to="/teams" className="text-sm">
                Teams
              </Link>
              <Link to="/logs" className="text-sm">
                Logs
              </Link>
              <button onClick={logout} className="text-sm text-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm">
                Login
              </Link>
              <Link to="/register" className="text-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
