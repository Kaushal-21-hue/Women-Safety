import React from "react";
import "../../styles/Sidebar.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { RiAdminLine } from 'react-icons/ri'

const Sidebar = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate()

  const handleSubmit = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logged Out Successfully");
    navigate('/login')
  };

  return (
    <div style={{ zIndex: '999' }}>
      <section className="sde">
        <div
          className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark vh-100"
          style={{ width: 280 }}
        >
          <ul className="mt-3">

            <Link to="/" style={{ textDecoration: "none" }} className="nav-item">
                <RiAdminLine size={25} className="mx-1" /> Admin Dashboard
            </Link>
          </ul>

          <hr />
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item sideBar">
              <Link to="/" style={{ textDecoration: "none" }} className="nav-link text-white">
                  <i className="fa-solid fa-house mx-2 text-white"></i>
                  Home
              </Link>
            </li>
            <li className="sideBar">
              <Link to="/dashboard" className="nav-link text-white">
                <i className="fa-solid fa-tower-broadcast mx-2 text-white"></i>
                Emergency Alert
              </Link>
            </li>
            <li className="sideBar">
              <Link to="/incident" className="nav-link text-white">
                <i className="fa-regular fa-flag mx-2 text-white"></i>
                Incident Report
              </Link>
            </li>
            <li className="sideBar">
              <Link to="/closedreport" className="nav-link text-white">
                <i className="fa-solid fa-folder-closed mx-2 text-white"></i>
                Closed Reports
              </Link>
            </li>

          </ul>
          <hr />
          <div className="dropdown">
            <button
              onClick={handleSubmit}
              style={{ textDecoration: "none", cursor: 'pointer', border: 'none', background: 'none' }}
              className="nav-link learn-more-btn-logout nav-item text-center"
              style={{ fontSize: "4px" }}
            >
              Logout
            </button>
          </div>
        </div>
      </section>

      <section className="abc dfe" style={{ marginTop: '5%' }}>
        <nav class="navt bg-white">
          <Link to='/' class="nav-linkt">
            <i class="fa-solid fa-house"></i>
            <span class="nav-text"></span>
          </Link>

          <Link to='/emerganceAlert' class="nav-linkt">
            <i class="fa-solid fa-tower-broadcast"></i>
            <span class="nav-text"></span>
          </Link>

          <Link to='/incident' class="nav-linkt">
            <i class="fa-regular fa-flag"></i>
            <span class="nav-text"></span>
          </Link>

          <Link to='closedreport' class="nav-linkt">
            <i class="fa-solid fa-folder-closed"></i>
            <span class="nav-text"></span>
          </Link>

          <button className="nav-linkt" onClick={handleSubmit} style={{border: 'none', background: 'none'}}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span className="nav-text"></span>
          </button>
        </nav>
      </section>
    </div>
  );
};

export default Sidebar;
