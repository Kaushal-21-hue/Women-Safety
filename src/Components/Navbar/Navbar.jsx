import React, { useEffect, useState } from 'react'
import { BiMenuAltRight, BiSun, BiMoon } from 'react-icons/bi'
import logo from '../../images/logo.png'
import { Link } from "react-router-dom"

import toast from 'react-hot-toast'
import '../../styles/navbar.css'
import { useAuth } from '../../context/auth'
import { useTheme } from '../../context/ThemeContext'

const Navbar = () => {
    const [auth, setAuth] = useAuth();
    const { isDark, toggleTheme } = useTheme();

    const handleSubmit = () => {
        setAuth({
            ...auth,
            user: null,
            token: ''
        })
        localStorage.removeItem('auth')
        toast.success('Logged Out Successfully')
    }

    useEffect(() => {
        const navBar = document.querySelectorAll(".nav-link");
        const navCollapse = document.querySelector(".navbar-collapse.collapse");

        const handleNavClick = () => {
            navCollapse.classList.remove("show");
        };

        navBar.forEach((a) => {
            a.addEventListener("click", handleNavClick);
        });

        return () => {
            navBar.forEach((a) => {
                a.removeEventListener("click", handleNavClick);
            });
        };
    }, []);

    return (
        <header className={`header_wrapper ${isDark ? 'dark' : ''}`}>
            <nav className="navbar navbar-expand-lg fixed-top">
                <div className="container-fluid mx-3">
                    <Link to='/'>
                        <img src={logo} style={{ width: '130px' }} alt="Safe Siren logo" />
                    </Link>
                    <button className="navbar-toggler pe-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <BiMenuAltRight size={35} />
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav menu-navbar-nav me-3">
                            <li className="nav-item">
                                <Link to='/' className="nav-link" style={{ textDecoration: 'none' }}>Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/about' className="nav-link" style={{ textDecoration: 'none' }}>About Us</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/contact' className="nav-link" style={{ textDecoration: 'none' }}>Contact Us</Link>
                            </li>
                            {auth?.user && (
                                <li className="nav-item">
                                    <Link to='/emergency-contacts' className="nav-link" style={{ textDecoration: 'none' }}>Emergency Contacts</Link>
                                </li>
                            )}
                        </ul>

                        <li className="nav-item theme-toggle" title="Toggle Dark Mode">
                            <button onClick={toggleTheme} className="nav-link p-2" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                {isDark ? <BiSun size={24} /> : <BiMoon size={24} />}
                            </button>
                        </li>

                        {!auth?.user ? (
                            <ul className='mt-2 text-center'>
                                <li className="nav-item text-center">
                                    <Link to='/login' className="nav-link learn-more-btn btn-extra-header" style={{ textDecoration: 'none' }}>Login</Link>
                                </li>
                                <li className="nav-item text-center">
                                    <Link to='/register' className="nav-link learn-more-btn" style={{ textDecoration: 'none' }}>Register</Link>
                                </li>
                            </ul>
                        ) : (
                            <ul className='mt-2 text-center'>
                                <li className="nav-item text-center">
                                    <Link to={`/dashboard${auth.user.role === 1 ? "/" : "/profile"}`} className="nav-link learn-more-btn" style={{ textDecoration: 'none' }}>Dashboard</Link>
                                </li>
                                <li className="nav-item text-center">
                                    <Link onClick={handleSubmit} to='/login' className="nav-link learn-more-btn-logout" style={{ textDecoration: 'none' }}>Logout</Link>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar

