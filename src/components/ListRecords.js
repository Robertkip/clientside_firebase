import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';

const ListRecords = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [updatedAddress, setUpdatedAddress] = useState('');
  const [updatedCity, setUpdatedCity] = useState('');
  const [updatedNFC, setUpdatedNFC] = useState('');
  const [updatedName, setUpdatedName] = useState('');
  const [updatedPhoneNo, setUpdatedPhoneNo] = useState('');
  const [updatedState, setUpdatedState] = useState('');
  const [updatedZipcode, setUpdatedZipcode] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newNFC, setNewNFC] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhoneNo, setNewPhoneNo] = useState('');
  const [newState, setNewState] = useState('');
  const [newZipcode, setNewZipcode] = useState('');

  // Fetch user records from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("idToken");
        if (!token) {
          throw new Error("No authentication token found.");
        }

        const response = await axios.get("https://node-firebase-7qjp.onrender.com/DNR", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          setUsers(response.data);
          console.log(response.data);
        } else {
          setError(`Unexpected response code: ${response.status}`);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching user records");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to handle delete action
  const handleDelete = async (uid) => {
    try {
      const token = localStorage.getItem("idToken");
      await axios.delete(`https://node-firebase-7qjp.onrender.com/DNR/${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      // Update the state to remove the deleted user
      setUsers((prevUsers) => ({
        ...prevUsers,
        users: prevUsers.users.filter(user => user.id !== uid),
      }));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user");
    }
  };

  // Function to open the edit modal
  const handleEdit = (user) => {
    setCurrentUser(user);
    setUpdatedAddress(user.Address);
    setUpdatedCity(user.City);
    setUpdatedNFC(user.NFC);
    setUpdatedName(user.Name);
    setUpdatedPhoneNo(user["Phone No."]);
    setUpdatedState(user.State);
    setUpdatedZipcode(user.zipcode);
    setShowEditModal(true);
  };

  // Function to update user
  const updateUser = async (id) => {
    try {
      const token = localStorage.getItem("idToken");
      const updatedUser = {
        Address: updatedAddress,
        City: updatedCity,
        NFC: updatedNFC,
        Name: updatedName,
        ["Phone No."]: updatedPhoneNo,
        State: updatedState,
        zipcode: updatedZipcode,
      };

      await axios.put(`https://node-firebase-7qjp.onrender.com/DNR/${id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      // Update the user in the state
      setUsers((prevUsers) => ({
        ...prevUsers,
        users: prevUsers.users.map(user => (user.id === id ? { ...user, ...updatedUser } : user)),
      }));
      setShowEditModal(false);
      console.log("User updated successfully");
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user");
    }
  };

  // Function to handle update action
  const handleUpdate = () => {
    if (currentUser) {
      updateUser(currentUser.id); // Call the updateUser function with the current user's UID
    }
  };

  // Function to handle create user
  const createUser = async () => {
    try {
      const token = localStorage.getItem("idToken");
      const newUser = {
        Address: newAddress,
        City: newCity,
        NFC: newNFC,
        Name: newName,
        ["Phone No."]: newPhoneNo,
        State: newState,
        zipcode: newZipcode,
      };

      const response = await axios.post("https://node-firebase-7qjp.onrender.com/DNR", newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      // Add the new user to the state
      setUsers((prevUsers) => ({
        ...prevUsers,
        users: [...prevUsers.users, response.data],
      }));
      setShowCreateModal(false);
      console.log("User created successfully");
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Failed to create user");
    }
  };

  // Render loading state or error message
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container">
      <h2>User Records</h2>
      <Button variant="success" onClick={() => setShowCreateModal(true)}>Create Record</Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Address</th>
            <th>City</th>
            <th>NFC</th>
            <th>Name</th>
            <th>Phone No.</th>
            <th>State</th>
            <th>zipcode</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users && users.status === "success" && (
            <>
              {console.log("Users:", users)} {/* Log users before mapping */}
              {users.users.map((user) => ( // Access the users array
                <tr key={user.id}> {/* Use 'id' as the unique key */}
                  <td>{user.id}</td>
                  <td>{user.Address}</td>
                  <td>{user.City}</td>
                  <td>{user.NFC}</td>
                  <td>{user.Name}</td>
                  <td>{user["Phone No."]}</td>
                  <td>{user.State}</td>
                  <td>{user.zipcode}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEdit(user)}>Edit</Button>
                    <Button variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </Table>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={updatedAddress}
                onChange={(e) => setUpdatedAddress(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={updatedCity}
                onChange={(e) => setUpdatedCity(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formNFC">
              <Form.Label>NFC</Form.Label>
              <Form.Control
                type="text"
                value={updatedNFC}
                onChange={(e) => setUpdatedNFC(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPhoneNo">
              <Form.Label>Phone No.</Form.Label>
              <Form.Control
                type="text"
                value={updatedPhoneNo}
                onChange={(e) => setUpdatedPhoneNo(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formState">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                value={updatedState}
                onChange={(e) => setUpdatedState(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formzipcode">
              <Form.Label>zipcode</Form.Label>
              <Form.Control
                type="text"
                value={updatedZipcode}
                onChange={(e) => setUpdatedZipcode(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create User Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formNewCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formNewNFC">
              <Form.Label>NFC</Form.Label>
              <Form.Control
                type="text"
                value={newNFC}
                onChange={(e) => setNewNFC(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formNewName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formNewPhoneNo">
              <Form.Label>Phone No.</Form.Label>
              <Form.Control
                type="text"
                value={newPhoneNo}
                onChange={(e) => setNewPhoneNo(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formNewState">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formNewZipcode">
              <Form.Label>zipcode</Form.Label>
              <Form.Control
                type="text"
                value={newZipcode}
                onChange={(e) => setNewZipcode(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={createUser}>
            Create User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListRecords;