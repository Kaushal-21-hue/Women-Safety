import React, { useEffect, useState } from 'react'
import { BiMenuAltRight } from 'react-icons/bi'
import logo from '../../images/logo.png'
import { Link } from "react-router-dom"

import toast from 'react-hot-toast'
import '../../styles/navbar.css'
import { useAuth } from '../../context/auth'

const Navbar = () => {

    const [auth, setAuth] = useAuth();

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
        <>
            {auth?.user?.role ? (
                <>
                    <header className='header_wrapper'>
                        <nav className="navbar navbar-expand-lg fixed-top">
                            <div className="container-fluid mx-3">
                                <Link to='/'>
                                    <img src={logo} style={{ width: '130px' }} alt="Safe Siren logo" />
                                </Link>
                                <button className="navbar-toggler pe-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                    <BiMenuAltRight size={35} />
                                </button>
                                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                                    <ul className="navbar-nav menu-navbar-nav">
                                        <li className="nav-item">
                                            <Link to='/' className="nav-link" aria-current="page" style={{ textDecoration: 'none' }}>Home</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to='/about' className="nav-link" aria-current="page" style={{ textDecoration: 'none' }}>About Us</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to='/contact' className="nav-link" aria-current="page" style={{ textDecoration: 'none' }}>Contact Us</Link>
                                        </li>
                                    </ul>

                                    {!auth.user ? (<ul className='mt-2 text-center'>
                                        <li className="nav-item text-center">
                                            <Link to='/login' className="nav-link learn-more-btn btn-extra-header" style={{ textDecoration: 'none' }}>Login</Link>
                                        </li>
                                        <li className="nav-item text-center">
                                            <Link to='/register' className="nav-link learn-more-btn" style={{ textDecoration: 'none' }}>Register</Link>
                                        </li>
                                    </ul>) : (<ul className='mt-2 text-center'>
                                        <li className="nav-item text-center">
                                            <Link to={`/dashboard${auth?.user?.role === 1 ? "/" : "/profile"}`} className="nav-link learn-more-btn" style={{ textDecoration: 'none' }}>Dashboard</Link>
                                        </li>
                                        <li className="nav-item text-center">
                                            <Link onClick={handleSubmit} to='/login' className="nav-link learn-more-btn-logout" style={{ textDecoration: 'none' }}>Logout</Link>
                                        </li>
                                    </ul>)
                                    }
                                </div>
                            </div>
                        </nav>
                    </header>
                </>
            ) : (<>
                <header className='header_wrapper'>
                    <nav className="navbar navbar-expand-lg fixed-top">
                        <div className="container-fluid mx-3">
                            <Link to='/'>
                                <img src={logo} style={{ width: '130px' }} alt="Safe Siren logo" />
                            </Link>
                            <button className="navbar-toggler pe-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <BiMenuAltRight size={35} />
                            </button>
                            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                                <ul className="navbar-nav menu-navbar-nav">
                                    <li className="nav-item text-center">
                                        <Link to='/emergency' className="nav-link learn-more-btn-logout" style={{ textDecoration: 'none' }}>Emergency</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to='/' className="nav-link" aria-current="page" style={{ textDecoration: 'none' }}>Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to='/about' className="nav-link" aria-current="page" style={{ textDecoration: 'none' }}>About Us</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to='/contact' className="nav-link" aria-current="page" style={{ textDecoration: 'none' }}>Contact Us</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to='/report' className="nav-link" aria-current="page" style={{ textDecoration: 'none' }}>Report Incident</Link>
                                    </li>
                                </ul>

                                {!auth.user ? (<ul className='mt-2 text-center'>
                                    <li className="nav-item text-center">
                                        <Link to='/login' className="nav-link learn-more-btn btn-extra-header" style={{ textDecoration: 'none' }}>Login</Link>
                                    </li>
                                    <li className="nav-item text-center">
                                        <Link to='/register' className="nav-link learn-more-btn" style={{ textDecoration: 'none' }}>Register</Link>
                                    </li>
                                </ul>) : (<ul className='mt-2 text-center'>
                                    <li className="nav-item text-center">
                                        <Link to={`/dashboard/${auth?.user?.role === 1 ? "/" : "profile"}`} className="nav-link learn-more-btn" style={{ textDecoration: 'none' }}>Profile</Link>
                                    </li>
                                    <li className="nav-item text-center">
                                        <Link onClick={handleSubmit} to='/login' className="nav-link learn-more-btn-logout" style={{ textDecoration: 'none' }}>Logout</Link>
                                    </li>
                                </ul>)}
                            </div>
                        </div>
                    </nav>
                </header>
            </>)}
        </>
    )
}

export default Navbar
