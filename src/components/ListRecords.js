import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import Loader from "../Image/Fidget-spinner.gif";
import Deleter from "../Image/Spinning arrows.gif";

const ListRecords = () => {
  const [records, setRecords] = useState([]);
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
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  // Fetch user records from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("idToken");
        if (!token) {
          throw new Error("No authentication token found.");
        }

        const response = await axios.get("https://node-application-36uh.onrender.com/DNR", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          setRecords(response.data);
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
    setDeleting(true);
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
      setRecords((prevRecords) => ({
        ...prevRecords,
        records: prevRecords.records.filter(record => record.id !== uid),
      }));
      console.log("Record deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete record");
    } finally {
      setDeleting(false);
      setLoading(false); // Reset loading state
    }
  };

  // Function to open the edit modal
  const handleEdit = (record) => {
    setCurrentUser(record);
    setUpdatedAddress(record.Address);
    setUpdatedCity(record.City);
    setUpdatedNFC(record.NFC);
    setUpdatedName(record.Name);
    setUpdatedPhoneNo(record.Phone_No);
    setUpdatedState(record.State);
    setUpdatedZipcode(record.zipcode);
    setShowEditModal(true);
  };

  // Function to update record
  const updateRecord = async (id) => {
    try {
      const token = localStorage.getItem("idToken");
      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      const updatedRecord = {
        Address: updatedAddress,
        City: updatedCity,
        NFC: updatedNFC,
        Name: updatedName,
        Phone_No: updatedPhoneNo, // Changed back to "Phone No."
        State: updatedState,
        zipcode: updatedZipcode,
      };

      // Send the PUT request to the backend
      const response = await axios.put(
        `https://node-application-36uh.onrender.com/DNR/${id}`,
        updatedRecord,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 204) {
        // Update the record in the state
        setRecords((prevRecords) => ({
          ...prevRecords,
          records: prevRecords.records.map((record) =>
            record.id === id ? { ...record, ...updatedRecord } : record
          ),
        }));

        setShowEditModal(false); // Close the edit modal
        console.log("Record updated successfully");
      } else {
        throw new Error(`Unexpected response code: ${response.status}`);
      }
    } catch (err) {
      console.error("Error updating record:", err);
      setError(err.response?.data?.message || "Failed to update record");
    }
  };

  const handleUpdate = () => {
    if (currentUser) {
      updateRecord(currentUser.id); // Call updateRecord with the current record's ID
    }
  };

  // Function to handle create user
  const createUser = async () => {
    setCreating(true);
    try {
      const token = localStorage.getItem("idToken");
      const newUser = {
        Address: newAddress,
        City: newCity,
        NFC: newNFC,
        Name: newName,
        Phone_No: newPhoneNo,
        State: newState,
        zipcode: newZipcode,
      };

      const response = await axios.post("https://node-application-36uh.onrender.com/DNR", newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      // Add the new user to the state
      setRecords((prevUsers) => ({
        ...prevUsers,
        records: [...prevUsers.records, response.data],
      }));
      setShowCreateModal(false);
      console.log("Record created successfully");
    } catch (err) {
      console.error("Error creating Record:", err);
      setError("Failed to create Record");
    } finally {
      setCreating(false);
      setLoading(false); // Reset loading state
    }
  };

  // Filter records based on search term
  const filteredRecords = records.records
    ? records.records.filter((record) =>
        record.Name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Render loading state or error message
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <img src={Loader} alt="Loading..." style={{ width: "100px", height: "100px" }} />
      </div>
    );
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="container">
      <h2>User Records</h2>
      <Button variant="success" onClick={() => setShowCreateModal(true)}>Create Record</Button>

      {/* Search Input */}
      <InputGroup className="mt-3 mb-3">
        <FormControl
          placeholder="Search by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {/* Conditional Rendering for Records */}
      {filteredRecords.length === 0 ? (
  <div className="mt-4">
    <p>No records available.</p> {/* Display "No records available" if no records match the search term */}
  </div>
      ) : (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Address</th>
              <th>City</th>
              <th>NFC</th>
              <th>Name</th>
              <th>Phone No</th>
              <th>State</th>
              <th>Zipcode</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.Address}</td>
                <td>{record.City}</td>
                <td>{record.NFC}</td>
                <td>{record.Name}</td>
                <td>{record.Phone_No}</td>
                <td>{record.State}</td>
                <td>{record.zipcode}</td>
                <td>
                  <Button variant="primary" onClick={() => handleEdit(record)}>Edit</Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(record.id)}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <img src={Deleter} alt="Loading..." style={{ width: "20px", height: "20px" }} />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Record</Modal.Title>
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
          <Modal.Title>Create Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                required="true"
              />
            </Form.Group>
            <Form.Group controlId="formNewCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                required="true"
              />
            </Form.Group>
            <Form.Group controlId="formNewNFC">
              <Form.Label>NFC</Form.Label>
              <Form.Control
                type="text"
                value={newNFC}
                onChange={(e) => setNewNFC(e.target.value)}
                required="true"
              />
            </Form.Group>
            <Form.Group controlId="formNewName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required="true"
              />
            </Form.Group>
            <Form.Group controlId="formNewPhoneNo">
              <Form.Label>Phone No.</Form.Label>
              <Form.Control
                type="text"
                value={newPhoneNo}
                onChange={(e) => setNewPhoneNo(e.target.value)}
                required="true"
              />
            </Form.Group>
            <Form.Group controlId="formNewState">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                required="true"
              />
            </Form.Group>
            <Form.Group controlId="formNewZipcode">
              <Form.Label>zipcode</Form.Label>
              <Form.Control
                type="text"
                value={newZipcode}
                onChange={(e) => setNewZipcode(e.target.value)}
                required="true"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={createUser}>
          {creating ? (
                      <img src={Deleter} alt="Loading..." style={{ width: "20px", height: "20px" }} />
                    ) : (
                      "create"
                    )}
            Create Record
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListRecords;