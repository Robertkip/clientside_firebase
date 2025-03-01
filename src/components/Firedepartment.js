// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useHistory } from 'react-router-dom';
// import { Table, Button, Form, Modal } from 'react-bootstrap';
// import Deleter from "../Image/Spinning arrows.gif";
// import Setter from "../Image/Settings.gif";

// const Firedepartment = () => {
//   const [records, setRecords] = useState({ users: [] }); // Initialize with `users` array
//   const [error, setError] = useState(null);
//   const [role, setRole] = useState('');
//   const [uid, setUid] = useState('');
//   const [loading, setLoading] = useState(true);
//   const history = useHistory();

//   // State for Edit Modal
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [updatedAddress, setUpdatedAddress] = useState('');
//   const [updatedCity, setUpdatedCity] = useState('');
//   const [updatedNFC, setUpdatedNFC] = useState('');
//   const [updatedName, setUpdatedName] = useState('');
//   const [updatedPhoneNo, setUpdatedPhoneNo] = useState('');
//   const [updatedState, setUpdatedState] = useState('');
//   const [updatedZipcode, setUpdatedZipcode] = useState('');

//   // State for Create Modal
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newAddress, setNewAddress] = useState('');
//   const [newCity, setNewCity] = useState('');
//   const [newNFC, setNewNFC] = useState('');
//   const [newName, setNewName] = useState('');
//   const [newPhoneNo, setNewPhoneNo] = useState('');
//   const [newState, setNewState] = useState('');
//   const [newZipcode, setNewZipcode] = useState('');
//   const [creating, setCreating] = useState(false);

//   // State for Delete
//   const [deleting, setDeleting] = useState(false);

//   // State for Search
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [isTouched, setIsTouched] = useState(false);
//   const [isNoRecordsFound, setIsNoRecordsFound] = useState(false);
//   const [hasBeenSearched, sethasBeenSearched] = useState(false);


//   const reloadPage = () => {
//     window.location.reload()
//   }
//   useEffect(() => {
//     const fetchRecords = async () => {
//       try {
//         const token = localStorage.getItem('idToken');
//         if (!token) {
//           throw new Error('No authentication token found.');
//         }

//         const response = await axios.get('http://localhost:8000/getAllRecords', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           withCredentials: true,
//         });

//         if (response.status === 200) {
//           setRecords(response.data);
//           console.log('Records fetched:', response.data);
//         } else {
//           setError(`Unexpected response code: ${response.status}`);
//         }
//       } catch (err) {
//         setError(err.response?.data?.message || err.message || 'Error fetching records');
//         if (err.response?.status === 401) {
//           history.push('/login'); // Redirect if unauthorized
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecords();
//   }, [history]);

//   // Handle search functionality
//   const fetchSearchResults = async () => {
//     sethasBeenSearched(true);
//     if (!searchQuery.trim()) {
//       setSearchResults([]);
//       setIsTouched(true);
//       setIsSearching(false);
//       return;
//     }

//     setIsSearching(true);
//     setSearchResults([]);

//     try {
//       const token = localStorage.getItem('idToken');
//       if (!token) {
//         throw new Error('No authentication token found.');
//       }

//       const response = await axios.get(
//         `http://localhost:8000/search?query=${encodeURIComponent(searchQuery)}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           withCredentials: true,
//         }
//       );

//       setSearchResults(response.data.records);
//       console.log("Search results:", response.data.records);

//       if (response.data.records.length === 0) {
//         setIsNoRecordsFound(true);
//       } else {
//         setIsNoRecordsFound(false);
//       }
//     } catch (error) {
//       console.error("Error fetching search results:", error.message);
//       setIsNoRecordsFound(true);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   // Function to handle delete action
//   const handleDelete = async (uid) => {
//     setDeleting(true);
//     try {
//       const token = localStorage.getItem('idToken');
//       await axios.delete(`http://localhost:8000/DNR/${uid}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         withCredentials: true,
//       });

//       setRecords((prevRecords) => ({
//         ...prevRecords,
//         users: prevRecords.users.filter(record => record.id !== uid),
//       }));
//       console.log("Record deleted successfully");
//     } catch (err) {
//       console.error("Error deleting user:", err);
//       setError("Failed to delete record");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   // Function to open the edit modal
//   const handleEdit = (record) => {
//     setCurrentUser(record);
//     setUpdatedAddress(record.Address);
//     setUpdatedCity(record.City);
//     setUpdatedNFC(record.NFC);
//     setUpdatedName(record.Name);
//     setUpdatedPhoneNo(record.Phone_No);
//     setUpdatedState(record.State);
//     setUpdatedZipcode(record.zipcode);
//     setShowEditModal(true);
//   };

//   // Function to update record
//   const updateRecord = async (id) => {
//     try {
//       const token = localStorage.getItem('idToken');
//       if (!token) {
//         throw new Error("Authentication token is missing.");
//       }

//       const updatedRecord = {
//         Address: updatedAddress,
//         City: updatedCity,
//         NFC: updatedNFC,
//         Name: updatedName,
//         Phone_No: updatedPhoneNo,
//         State: updatedState,
//         zipcode: updatedZipcode,
//       };

//       const response = await axios.put(
//         `http://localhost:8000/DNR/${id}`,
//         updatedRecord,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           withCredentials: true,
//         }
//       );

//       if (response.status === 200 || response.status === 204) {
//         setRecords((prevRecords) => ({
//           ...prevRecords,
//           users: prevRecords.users.map((record) =>
//             record.id === id ? { ...record, ...updatedRecord } : record
//           ),
//         }));

//         setShowEditModal(false);
//         console.log("Record updated successfully");
//       } else {
//         throw new Error(`Unexpected response code: ${response.status}`);
//       }
//     } catch (err) {
//       console.error("Error updating record:", err);
//       setError(err.response?.data?.message || "Failed to update record");
//     }
//   };

//   const handleUpdate = () => {
//     if (currentUser) {
//       updateRecord(currentUser.id);
//     }
//   };

//   // Function to handle create user
//   const createUser = async () => {
//     setCreating(true);
//     try {
//       const token = localStorage.getItem('idToken');
//       const newUser = {
//         Address: newAddress,
//         City: newCity,
//         NFC: newNFC,
//         Name: newName,
//         Phone_No: newPhoneNo,
//         State: newState,
//         zipcode: newZipcode,
//       };

//       const response = await axios.post("http://localhost:8000/DNR", newUser, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         withCredentials: true,
//       });

//       setRecords((prevUsers) => ({
//         ...prevUsers,
//         users: [...prevUsers.users, response.data],
//       }));
//       setShowCreateModal(false);
//       console.log("Record created successfully");
//     } catch (err) {
//       console.error("Error creating Record:", err);
//       setError("Failed to create Record");
//     } finally {
//       setCreating(false);
//     }
//   };

// //   const reloadPage = () => {
// //     window.location.reload();
// //   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   let placeholder = isTouched && !searchQuery.trim() ? "Please enter a search term." : "Search by name";

//   return (
//     <div className="container">
//       <h2>User Records</h2>
//       <Button variant="success" onClick={() => setShowCreateModal(true)}>Create Record</Button><br></br>

//       {/* Search Input */}
//       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//         <input
//           type="text"
//           placeholder={placeholder}
//           value={searchQuery}
//           className="form-control mb-3 mt-3 w-25"
//           onChange={(e) => setSearchQuery(e.target.value)}
//           required
//         />
//         <button
//           onClick={fetchSearchResults}
//           className="btn btn-primary"
//         >
//           {isSearching ? "Searching..." : "Search"}
//         </button>
//         <button onClick={reloadPage}
//       className="btn btn-secondary"
//       >Reset</button>      
//       </div>

//       {/* Results Table */}
//       <Table className="mt-4 table-responsive">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Address</th>
//             <th>City</th>
//             <th>NFC</th>
//             <th>Name</th>
//             <th>Phone No</th>
//             <th>State</th>
//             <th>Zipcode</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {isSearching ? (
//                       <tr>
//                           <img
//                               src={Setter} alt="Loading..." style={{ width: "100px", height: "100px", justifyItems: "center", alignItems: "center" }}
//                           />
//                           </tr>
//           ) : searchResults.length > 0 ? (
//             searchResults.map((record) => (
//               <tr key={record.id}>
//                 <td>{record.id}</td>
//                 <td>{record.Address}</td>
//                 <td>{record.City}</td>
//                 <td>{record.NFC}</td>
//                 <td>{record.Name}</td>
//                 <td>{record.Phone_No}</td>
//                 <td>{record.State}</td>
//                 <td>{record.zipcode}</td>
//                 <td>
//                   <Button variant="primary" onClick={() => handleEdit(record)}>Edit</Button>{" "}
//                   <Button
//                     variant="danger"
//                     onClick={() => handleDelete(record.id)}
//                     disabled={deleting}
//                   >
//                                  {deleting ? (
//                 <img src={Deleter} alt="Loading..." style={{ width: "20px", height: "20px" }} />
//               ) : (
//                 "Delete"
//               )}
//                   </Button>
//                 </td>
//               </tr>
//             ))
//           ) : records.users.length > 0 && !hasBeenSearched ? (
//             records.users.map((record) => (
//               <tr key={record.id}>
//                 <td>{record.id}</td>
//                 <td>{record.Address}</td>
//                 <td>{record.City}</td>
//                 <td>{record.NFC}</td>
//                 <td>{record.Name}</td>
//                 <td>{record.Phone_No}</td>
//                 <td>{record.State}</td>
//                 <td>{record.zipcode}</td>
//                 <td>
//                   <Button variant="primary" onClick={() => handleEdit(record)}>Edit</Button>{" "}
//                   <Button
//                     variant="danger"
//                     onClick={() => handleDelete(record.id)}
//                     disabled={deleting}
//                   >
//               {deleting ? (
//                 <img src={Deleter} alt="Loading..." style={{ width: "20px", height: "20px" }} />
//               ) : (
//                 "Delete"
//               )}</Button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="9" className="text-danger">No records found.</td>
//             </tr>
//           )}
//         </tbody>
//       </Table>

//       {/* Edit User Modal */}
//       <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Record</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group controlId="formAddress">
//               <Form.Label>Address</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={updatedAddress}
//                 onChange={(e) => setUpdatedAddress(e.target.value)}
//               />
//             </Form.Group>
//             <Form.Group controlId="formCity">
//               <Form.Label>City</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={updatedCity}
//                 onChange={(e) => setUpdatedCity(e.target.value)}
//               />
//             </Form.Group>
//             <Form.Group controlId="formNFC">
//               <Form.Label>NFC</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={updatedNFC}
//                 onChange={(e) => setUpdatedNFC(e.target.value)}
//               />
//             </Form.Group>
//             <Form.Group controlId="formName">
//               <Form.Label>Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={updatedName}
//                 onChange={(e) => setUpdatedName(e.target.value)}
//               />
//             </Form.Group>
//             <Form.Group controlId="formPhoneNo">
//               <Form.Label>Phone No.</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={updatedPhoneNo}
//                 onChange={(e) => setUpdatedPhoneNo(e.target.value)}
//               />
//             </Form.Group>
//             <Form.Group controlId="formState">
//               <Form.Label>State</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={updatedState}
//                 onChange={(e) => setUpdatedState(e.target.value)}
//               />
//             </Form.Group>
//             <Form.Group controlId="formzipcode">
//               <Form.Label>Zipcode</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={updatedZipcode}
//                 onChange={(e) => setUpdatedZipcode(e.target.value)}
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowEditModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleUpdate}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Create User Modal */}
//       <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Create Record</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group controlId="formNewAddress">
//               <Form.Label>Address</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={newAddress}
//                 onChange={(e) => setNewAddress(e.target.value)}
//                 required
//               />
//             </Form.Group>
//             <Form.Group controlId="formNewCity">
//               <Form.Label>City</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={newCity}
//                 onChange={(e) => setNewCity(e.target.value)}
//                 required
//               />
//             </Form.Group>
//             <Form.Group controlId="formNewNFC">
//               <Form.Label>NFC</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={newNFC}
//                 onChange={(e) => setNewNFC(e.target.value)}
//                 required
//               />
//             </Form.Group>
//             <Form.Group controlId="formNewName">
//               <Form.Label>Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={newName}
//                 onChange={(e) => setNewName(e.target.value)}
//                 required
//               />
//             </Form.Group>
//             <Form.Group controlId="formNewPhoneNo">
//               <Form.Label>Phone No.</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={newPhoneNo}
//                 onChange={(e) => setNewPhoneNo(e.target.value)}
//                 required
//               />
//             </Form.Group>
//             <Form.Group controlId="formNewState">
//               <Form.Label>State</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={newState}
//                 onChange={(e) => setNewState(e.target.value)}
//                 required
//               />
//             </Form.Group>
//             <Form.Group controlId="formNewZipcode">
//               <Form.Label>Zipcode</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={newZipcode}
//                 onChange={(e) => setNewZipcode(e.target.value)}
//                 required
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={createUser}>
//           {creating ? (
//               <img src={Deleter} alt="Loading..." style={{ width: "20px", height: "20px" }} />
//             ) : (
//               "Create Record"
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Role Creation Form */}
//       <div>
//         <h2>Create Role</h2>
//         <Form
//           onSubmit={(e) => {
//             e.preventDefault();
//             // createRole();
//           }}
//         >
//           <Form.Group controlId="formRole">
//             <Form.Label>Role</Form.Label>
//             <Form.Control
//               type="text"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               placeholder="Enter role"
//               required
//             />
//           </Form.Group>
//           <Form.Group controlId="formUid">
//             <Form.Label>UID</Form.Label>
//             <Form.Control
//               type="text"
//               value={uid}
//               onChange={(e) => setUid(e.target.value)}
//               placeholder="Enter UID"
//               required
//             />
//           </Form.Group>
//           <Button type="submit">Create Role</Button>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default Firedepartment;