import React, { useState,  } from "react"
import { Card, Button, Alert, Form } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import axios from 'axios';


export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const [role, setRole] = useState('');
  const [uid, setUid] = useState('');
  const history = useHistory()

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  const createRole = async () => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("idToken");
  
      // Check if the token exists
      if (!token) {
        throw new Error("No authentication token found.");
      }
  
      // Ensure `role` and `uid` are defined in the component state or passed as arguments
      if (!role || !uid) {
        throw new Error("Role or UID is missing.");
      }
      //check if the uid === admin already exists
      if (uid === "admin") {
        throw new Error("Admin role already exists.");
      }
      // Create the new role object
      const newRole = {
        role: role, // `role` should be defined in the component state or passed as an argument
        uid: uid,   // `uid` should be defined in the component state or passed as an argument
      };
  
      // Send a POST request to the server
      const response = await axios.post("http://localhost:8000/setRole", newRole, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
  
      // Optionally, you can return the response data
      console.log("Role created successfully:", response.data);
      return response.data;
      // Return the response data or perform any other actions

    } catch (error) {
      console.error("Error creating role:", error.message);
      //if the role is admin then it will throw an error
      // Handle the error (e.g., display a message to the user)
      throw error; // Re-throw the error if needed
    }
    // Handle the error (e.g., display a message to the user)

  };


  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {currentUser.email}<br />
          <strong>Uid: </strong> {currentUser.uid}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button> 
          </div>
    </>
  )
}
