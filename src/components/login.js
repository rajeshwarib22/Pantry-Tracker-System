import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase"; // Ensure this import is correct
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in Successfully");
      toast.success("User logged in Successfully", { position: "top-center" });

      // Redirect after successful login
      navigate("/profile");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
    <>
      <header>
        <div className="container">
          <h1>PantryPulse</h1>
          <nav>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h2>Manage Your Pantry with Ease</h2>
            <p>
              Keep track of your pantry items, reduce waste, and stay organized.
              Start using PantryPulse a Pantry Tracker today!
            </p>
            <a href="#login/signup" className="cta-button">
              Get Started
            </a>
          </div>
        </section>

        <section id="features" className="features-section">
          <div className="container">
            <h2>Features</h2>
            <div className="feature-cards">
              <div className="feature-card">
                <h3>Track Inventory</h3>
                <p>
                  Monitor the items in your pantry and stay on top of what you
                  have.
                </p>
              </div>
              <div className="feature-card">
                <h3>Reduce Waste</h3>
                <p>
                  Get notified when items are about to expire and avoid throwing
                  away food.
                </p>
              </div>
              <div className="feature-card">
                <h3>Easy Management</h3>
                <p>
                  Add, update, and remove items with a simple and intuitive
                  interface.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" class="features-section">
          <div class="container">
            <h2>About</h2>
            <div class="feature-cards">
              <div class="about-card">
                <p>
                  PantryPulse helps you keep your groceries organized by keeping
                  a detailed inventory. You can keep track of quantity and
                  expiration dates of your items.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="login/signup" className="features-section">
          <div class="container">
            <h2>Login</h2>
            <div class="feature-cards">
              <div class="about-card">
                <div className="auth-wrapper">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label>Email address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label>Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                    </div>
                    <p className="forgot-password text-right">
                      New user <a href="/register">Register Here</a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <p>&copy; 2024 Pantry Tracker. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default Login;
