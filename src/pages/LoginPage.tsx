import React, { useState } from 'react';
import axiosInstance from '../utils/requestLogger'; // Updated import to use the axios instance
import { useNavigate } from 'react-router-dom';
import '../styles.css'; // Importing consolidated CSS
import config from '../config.json'; // Importing configuration
import Modal from '../components/Modal'; // Importing Modal component

interface LoginPageProps {
  isModalOpen: boolean; // Added prop type for modal visibility
  closeModal: () => void; // Added prop type for closing modal
}

const LoginPage: React.FC<LoginPageProps> = ({ isModalOpen, closeModal }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      const response = await axiosInstance.post(`${config.backendAPIBaseUrl}/login`, {
        username,
        password,
      });

      // DEBUG:
      // console.log('Login response:', response); // Log the entire response object

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.level); // Store user level
      console.log('Token stored:', response.data.token); // Log the token
      console.log('User role stored:', response.data.level); // Log the user role
      closeModal(); // Close modal on successful login
      
      navigate('/latest-rss-items'); // Change this to where we want to go after a successful login

      // Clear the input fields
      setUsername('');
      setPassword('');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div id="content">
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Login">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Login</button>
        </form>
      </Modal>
    </div>
  );
};

export default LoginPage;
