import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase"; // Ensure this import is correct
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.", {
        position: "top-center",
      });
      navigate("/login");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
    <>
      <div className="container">
        <h2>Forgot Password</h2>
        <p>Enter your email address to receive a password reset link.</p>
        <form onSubmit={handlePasswordReset}>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Reset Password
            </button>
          </div>
          <p className="forgot-password text-right">
            <a href="/login">Back to Login</a>
          </p>
        </form>
      </div>
    </>
  );
}

export default ForgotPassword;
