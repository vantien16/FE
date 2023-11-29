import React, { useState } from "react";
import axios from "axios";
import "./forgotpassword.scss";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Invalid email format");
      return;
    }
    try {
      // Send a request to your backend to initiate the password reset process
      const response = await axios.post(
        "http://localhost:8080/forgot_password",
        {
          email: email,
        }
      );

      setMessage(response.data.data);
      if (response.status === 200) {
        navigate("/reset-password");
      }
      console.log("cc to");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="forgot-password-container">
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>
      <div className="forgot-password">
        <h2 className="title">Forgot Password</h2>
        <form className="form-pass" onSubmit={handleForgotPassword}>
          <input
            className="contentforgot"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="submitforgot" type="submit">
            Submit
          </button>
        </form>
        {message && <p className="msg">{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
