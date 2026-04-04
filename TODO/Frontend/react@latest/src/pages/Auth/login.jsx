import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import "./Auth.css"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //login function
  const loginHandler = (e) => {
    try {
      e.preventDefault();
      alert("login Data" + email + " " + password);
    }
    catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="form-container">
      <div className="form">
        <div className="mb-3">
          <i className="fa-solid fa-circle-user"></i>
        </div>
        <div className="mb-3">
          <input type="email" className="form-control" placeholder="enter email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" placeholder="enter password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        </div>
        <div className="form-bottom">
          <p className="text-center">not a user? please
            <Link to="/register">Register</Link>
          </p>
          <button type="submit" className="Login-btn" onClick={loginHandler}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default Login
