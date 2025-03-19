import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import PantryItemOperations from "./pantryitemlistoperations";
import logo from "../images/logo.png";
// import RecipeGenerator from "./recipeGenerator";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            console.log("No user data found");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-wrapper">
      {userDetails ? (
        <>
          <nav className="navbar navbar-inverse">
            <div className="container-fluid">
              <div className="navbar-left">
                <img src={logo} alt="Pantry Logo" className="logo" />
                <span className="app-title">PantryPulse</span>
              </div>
              <div className="navbar-header">
                Welcome: {userDetails.firstName}
              </div>

              <ul className="nav navbar-nav navbar-right">
                <li>
                  <button className="btn-logout" onClick={handleLogout}>
                    <span className="glyphicon glyphicon-log-in"></span> Logout
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          <div className="main-container">
            <div className="sidebar">
              <button onClick={() => setSelectedComponent("pantry")}>
                Show Pantry Items
              </button>
              {/* <button onClick={() => setSelectedComponent("recipes")}>
                Recipes
              </button> */}
            </div>

            <div className="content">
              {selectedComponent === "pantry" && <PantryItemOperations />}
              {/* {selectedComponent === "recipes" && <RecipeGenerator />} */}
            </div>
          </div>
        </>
      ) : (
        <p>No user details available</p>
      )}
    </div>
  );
}

export default Profile;
