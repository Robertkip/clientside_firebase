import React, { useState  } from "react"
import { Card, Form, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import axios from 'axios';


export default function Dashboard() {
  // const [records, setRecords] = useState([]);
  // const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  // const [role, setRole] = useState('');
  // const [uid, setUid] = useState('');
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

  // const createRole = async () => {
  //   try {
  //     // Retrieve the token from localStorage
  //     const token = localStorage.getItem("idToken");
  
  //     // Check if the token exists
  //     if (!token) {
  //       throw new Error("No authentication token found.");
  //     }
  
  //     // Ensure `role` and `uid` are defined in the component state or passed as arguments
  //     if (!role || !uid) {
  //       throw new Error("Role or UID is missing.");
  //     }

  //     //check if the uid === admin already exists
  //     if (uid === "admin") {
  //       throw new Error("Admin role already exists.");
  //     }
  //     // Create the new role object
  //     const newRole = {
  //       role: role, // `role` should be defined in the component state or passed as an argument
  //       uid: uid,   // `uid` should be defined in the component state or passed as an argument
  //     };
  
  //     // Send a POST request to the server
  //     const response = await axios.post("https://node-application-36uh.onrender.com/setRole", newRole, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       withCredentials: true,
  //     });
  //     // Optionally, you can return the response data
  //     console.log("Role created successfully:", response.data);
  //     return response.status;
  //     // Return the response data or perform any other actions
  //   } catch (error) {
  //     console.log("Error is", error.status);
  //     console.error("Error creating role:", error.message);
  //     if (error.response) {
  //       console.log("Error Response Is", error.response);
  //       const { status, data } = error.response;
  
  //       if (status === 400) {
  //         console.log(status)
  //         setError(data.details || "Invalid request. Please check your input.");
  //       } else if (status === 401) {
  //         setError(data.details || "Unauthorized. Token expired");
  //       } else if (status === 500) {
  //         setError(data.details || "User is already an admin");
  //       } else if (status === 409) {
  //         setError(data.details || "Role already exists.");
  //       }
  //     } else {
  //       setError(error.details || "Failed to create role.");
  //     }
  //   }
  //   // Handle the error (e.g., display a message to the user)

  // };


  return (
    <>
            {/* <Form
          onSubmit={(e) => {
            e.preventDefault();
            createRole();
          }}
        >
          <Form.Group controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Control
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Enter admin role"
              required
            />
          </Form.Group>
          <Form.Group controlId="formUid">
            <Form.Label>UID</Form.Label>
            <Form.Control
              type="text"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="Enter your UID"
              required
            />
          </Form.Group>
          {error && <Alert variant="danger">{error}</Alert>}
          <Button type="submit">Create Role</Button>
        </Form> */}
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
         
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
