import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../images/logo.png";
import "../App.css";

const featureData = [
  {
    title: "Track Inventory",
    description: "Monitor pantry items and stay organized.",
  },
  {
    title: "Reduce Waste",
    description: "Get notified before food expires.",
  },
  {
    title: "Easy Management",
    description: "Quickly add, update, or remove items.",
  },
];

const aboutInfo = {
  title: "Your Own Pantry Buddy",
  description:
    "helps you track your groceries, including quantity and expiration dates.",
};

function SlidingCards() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % featureData.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="left-content"
      initial={{ x: "-100vw" }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 50 }}
    >
      <AnimatePresence mode="wait">
        {index < featureData.length && (
          <motion.div
            key={index}
            className="feature-card"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3>{featureData[index].title}</h3>
            <p>{featureData[index].description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("User logged in Successfully", { position: "top-center" });
      navigate("/profile"); // Redirect after successful login
    } catch (error) {
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
    <>
      {/* Main Container */}
      <main className="login-container">
        {/* Left Section: Sliding Cards */}
        <div className="left-section">
          <div className="logo-container">
            <img
              src={logo}
              alt="PantryPulse Logo"
              className="logo"
              style={{
                width: "30%",
                maxWidth: "300px",
                minWidth: "100px",
                height: "auto",
              }}
            />
            <div className="about-section">
              <h2>{aboutInfo.title}</h2>
              <p>{aboutInfo.description}</p>
            </div>
          </div>
          <SlidingCards />
        </div>

        {/* Right Section: Login Card */}
        <motion.div
          className="login-card"
          initial={{ x: "100vw" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 50 }}
        >
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
            <p className="forgot-password">
              <a href="/forgotpassword">Forgot Password?</a>
              <br />
              New user? <a href="/register">Register Here!</a>
            </p>
          </form>
        </motion.div>
      </main>

      {/* Footer */}
      <footer>
        <div className="container">
          <p>&copy; 2025 Pantry Pulse. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default Login;
