// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useHistory } from 'react-router-dom';
// import { Table, Button, Form } from 'react-bootstrap';

// const Firedepartment = () => {
//   const [records, setRecords] = useState({ users: [] }); // Initialize with `users` array
//   const [error, setError] = useState(null);
//   const [role, setRole] = useState('');
//   const [uid, setUid] = useState('');
//   const [loading, setLoading] = useState(true);
//   const history = useHistory();

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

//   const createRole = async () => {
//     try {
//       const token = localStorage.getItem('idToken');

//       if (!token) {
//         throw new Error('No authentication token found.');
//       }

//       const newRole = {
//         role: role, // Ensure `role` is defined in the component state
//         uid: uid,   // Ensure `uid` is defined in the component state
//       };

//       const response = await axios.post('http://localhost:8000/setRole', newRole, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         withCredentials: true,
//       });

//       // Update the state to reflect the new role assignment
//       setRecords((prevRecords) => ({
//         ...prevRecords,
//         users: prevRecords.users.map((user) =>
//           user.id === uid ? { ...user, role: role } : user
//         ),
//       }));

//       console.log('Role created successfully:', response.data);
//       alert('Role created successfully!');
//     } catch (err) {
//       console.error('Error creating role:', err);
//       setError('Invalid role. Only "admin" role is allowed');

//       if (err.response?.status === 401) {
//         history.push('/login'); // Redirect if unauthorized
//       }
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div>
//       <h1>User Records</h1>
//       {records.users.length > 0 ? (
//         <Table border="1">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Address</th>
//               <th>City</th>
//               <th>Phone Number</th>
//               <th>State</th>
//               <th>Zipcode</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {records.users.map((record) => (
//               <tr key={record.id}>
//                 <td>{record.id}</td>
//                 <td>{record.Name}</td>
//                 <td>{record.Address}</td>
//                 <td>{record.City}</td>
//                 <td>{record.Phone_No}</td>
//                 <td>{record.State}</td>
//                 <td>{record.zipcode}</td>
//                 <td>
//                   <Button variant="danger">Delete</Button>
//                   <Button variant="primary">Edit</Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       ) : (
//         <p>No records available</p>
//       )}

//       <div>
//         <h2>Create Role</h2>
//         <Form
//           onSubmit={(e) => {
//             e.preventDefault(); // Prevent default form submission
//             createRole(); // Call the createRole function
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