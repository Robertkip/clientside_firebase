import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import SweetAlert2 from 'react-sweetalert2';
export default function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const [swalProps, setSwalProps] = useState({});

  async function checkEmailExists(email) {
    try {
      const response = await fetch('https://node-application-36uh.onrender.com/check-email', {
        method: 'POST', // Use POST method
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
        },
        body: JSON.stringify({ email }), // Send email in the request body
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data.exists; 
    } catch (error) {
      console.error('Error checking email:', error);
      throw error; // Re-throw the error for handling in the calling function
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
  
    // Check if passwords match
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setError("Passwords do not match");
      setLoading(false); // Reset loading state if passwords don't match
      return;
    }
  
    try {
      setError(""); // Clear any previous errors
      setLoading(true); // Set loading state to true
  
      // Check if email already exists
      const emailExists = await checkEmailExists(emailRef.current.value);
      if (emailExists) {
        // Throw an error if email exists
        throw new Error("Email already exists"); 
      }
      // Proceed with signup if email does not exist
      await signup(emailRef.current.value, passwordRef.current.value);
      //Display user that the signup was successful
      console.log("Signup successful!" + emailRef.current.value);
      // alert("Signup successful!");
      handleClick(emailRef.current.value);
      // Redirect to login page after successful signup
      setTimeout(() => {
        history.push("/login");
      }, 5000);
    } catch (error) {
      console.error("Signup failed:", error.message); // Log the error for debugging
      setError(error.message || "Failed to create an account"); // Inform the user of the failure
    } finally {
      setLoading(false); // Ensure loading state is reset after the try-catch block
    }
  }
//Added function to display alert message
  function handleClick(email){
    setSwalProps({
        show: true,
        title:  'Signup successfully',
        text: `Email:  ${email} has been successfully registered`,
        icon: 'success',
    }); 
  
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          <div>
            <div>

              <SweetAlert2 {...swalProps}></SweetAlert2>
            </div>

            <SweetAlert2 {...swalProps} />
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </>
  )
}
