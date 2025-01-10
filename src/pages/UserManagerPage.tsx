import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles.css'; // Importing consolidated CSS
import Modal from '../components/Modal'; // Importing Modal component
import config from '../config.json'; // Importing configuration

const UserManagerPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [user_name, setUsername] = useState<string>('');
  const [user_password, setPassword] = useState<string>('');
  const [user_password2, setPassword2] = useState<string>('');
  const [user_token, setToken] = useState<string>('');
  const [user_level, setUserLevel] = useState<string>('user'); // default to user
  const [currentPage, setCurrentPage] = useState<number>(1); // default to 1
  const [totalPages, setTotalPages] = useState<number>(1); // default to 1
  const [error, setError] = useState<string | null>(null); // Error state
  const [loading, setLoading] = useState(false); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isEditMode, setIsEditMode] = useState(false); // Edit mode state
  const [currentUserId, setCurrentUserId] = useState<number | null>(null); // Current user ID for editing
  const [itemsPerPage, setItemsPerPage] = useState<number>(10); // Default 10 items per page

  useEffect(() => {
    fetchUsers();
  }, [itemsPerPage, itemsPerPage]); // Update effect dependencies

  const fetchUsers = async () => {
    setLoading(true); // Set loading to true
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.backendAPIBaseUrl}/users?page_size=${itemsPerPage}`, {
        headers: {
          Authorization: token, // Send the token without "Bearer" prefix
        },
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleAddUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!user_name) {
      setError('Username is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${config.backendAPIBaseUrl}/create_user`, {
        "username": user_name,
        "password": user_password,
        "user_level": user_level,
        "token": user_token,
      }, {
        headers: {
          Authorization: token, // Send the token without "Bearer" prefix
        },
      });
      fetchUsers(); // Refresh the user list
      resetModalUserData()
      setIsModalOpen(false); // Close the modal after adding
    } catch (err) {
      console.error('Error adding user:', err);
      setError('Failed to add user');
    }
  };

  const handleEditUser = (user: any) => {
    setUsername(user.username);
    setUserLevel(user.user_level);
    setToken(user.token);
    setCurrentUserId(user.id); // Set the current user ID for editing
    setIsEditMode(true); // Set edit mode to true
    setIsModalOpen(true); // Open the modal
  };

  const resetModalUserData = async () => {
    setCurrentUserId(null); // Reset current user ID
    setUsername('');
    setToken('');
    setPassword('');
    setPassword2('');
    setCurrentUserId(null);
    setUserLevel('USER');
  }

  const handleUpdateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!user_name) {
      setError('Username is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${config.backendAPIBaseUrl}/update_user`, {
        "username" : user_name,
        "user_level": user_level,
        "token": user_token,
      }, {
        headers: {
          Authorization: token, // Send the token without "Bearer" prefix
        },
      });
      fetchUsers(); // Refresh the user list
      resetModalUserData();
      setIsModalOpen(false); // Close the modal after updating
      setIsEditMode(false); // Reset edit mode
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user');
    }
  };

  const handleDeleteUser = async (username: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${config.backendAPIBaseUrl}/delete_user/${username}`, {
        headers: {
          Authorization: token, // Send the token without "Bearer" prefix
        },
      });
      fetchUsers(); // Refresh the user list
      resetModalUserData();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  return (
    <div id="content">
      <button className="add-user-button" onClick={() => { setIsEditMode(false); setIsModalOpen(true); }}>Add User</button> {/* Button to open modal */}
      <h2>User Management</h2>
      <div>
        <label htmlFor="itemsPerPage">Items per page:</label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={75}>75</option>
          <option value={100}>100</option>
        </select>
      </div>

      <br />
      <div>
      <button onClick={handleFirstPage} disabled={currentPage === 1}>First</button> &nbsp;
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button> &nbsp;
        <span> Page {currentPage} of {totalPages} </span>&nbsp;&nbsp;
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button> &nbsp;
        <button onClick={handleLastPage} disabled={currentPage === 1}>Last</button>
      </div>
      <br />

      {loading ? ( // Show loading spinner if loading
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>User Level</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.user_level}</td>
                <td>
                  <button onClick={() => handleEditUser(user)}>Edit</button> {/* Edit button */}
                  <button onClick={() => handleDeleteUser(user.username)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for adding or editing user */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit User" : "Add User"}>
        <form onSubmit={isEditMode ? handleUpdateUser : handleAddUser}>
          <div>
            {!isEditMode ? ( 
              <>
              <label>Username:</label>
              <input
                type="text"
                value={user_name}
                onChange={(e) => setUsername(e.target.value)} />
              <br /><br />
              <label>Password:</label>
              <input
                type="password"
                value={user_password}
                onChange={(e) => setPassword(e.target.value)} />
              <br /><br />
              <label>Verify Password:</label>
              <input
                type="password"
                value={user_password2}
                onChange={(e) => setPassword2(e.target.value)} />
              <br /><br />
              </>
            ) : (
              <>
                <label>Username: {user_name}</label><br /><br />
              </>
            )}
          </div>
          <div>
            <label>User Level:</label>
            <select value={user_level} onChange={(e) => setUserLevel(e.target.value)}>
              <option value="public">Public</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select><br /><br />
          </div>
          {isEditMode ? ( 
            <>
              <div>
                <label>Token:</label>
                <input
                  type="text"
                  value={user_token}
                  onChange={(e) => setToken(e.target.value)}
                />
              </div>
            </>
          ):(
            <>
            </>
          )}

          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="modal-footer">
            <button type="submit">{isEditMode ? 'Update User' : 'Add User'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagerPage;
