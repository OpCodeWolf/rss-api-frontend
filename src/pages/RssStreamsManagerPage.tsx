import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/requestLogger'; // Updated import to use the axios instance
import '../styles.css'; // Importing consolidated CSS
import Modal from '../components/Modal'; // Importing Modal component
import config from '../config.json'; // Importing configuration

const RssStreamsManagerPage: React.FC = () => {
  const [streams, setStreams] = useState<any[]>([]);
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [itemsPerPage, setItemsPerPage] = useState(10); // New state for items per page

  useEffect(() => {
    fetchStreams();
  }, [currentPage, itemsPerPage]); // Update effect dependencies

  const fetchStreams = async () => {
    setLoading(true); // Set loading to true
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(`${config.backendAPIBaseUrl}/rss_streams?page=${currentPage}&page_size=${itemsPerPage}`, {
        headers: {
          Authorization: token, // Send the token without "Bearer" prefix
        },
      });
      console.log('Fetched streams response:', response.data); // Log the entire API response
      setStreams(response.data || []); // Set streams from the response, default to empty array
      setTotalPages(response.data.total_pages || 1); // Set total pages from the response, default to 1
    } catch (err) {
      console.error('Error fetching streams:', err);
      setError('Failed to fetch streams');
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const updateAllStreams = async () => {
    setLoading(true); // Set loading to true
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post(`${config.backendAPIBaseUrl}/rss_update_streams`, {}, {
        headers: {
          Authorization: token, // Send the token without "Bearer" prefix
        },
      });
      console.log('Updated streams response:', response.data); // Log the entire API response
    } catch (err) {
      console.error('Error updating streams:', err);
      setError('Failed to update streams');
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleAddStream = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!link) {
      setError('Link is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post(`${config.backendAPIBaseUrl}/rss_streams`, {
        link,
      }, {
        headers: {
          Authorization: token, // Send the token without "Bearer" prefix
        },
      });
      fetchStreams(); // Refresh the stream list
      setLink('');
      setIsModalOpen(false); // Close the modal after adding
    } catch (err) {
      console.error('Error adding stream:', err);
      setError('Failed to add stream');
    }
  };

  const handleDeleteStream = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`${config.backendAPIBaseUrl}/rss_streams/${id}`, {
        headers: {
          Authorization: token, // Send the token without "Bearer" prefix
        },
      });
      fetchStreams(); // Refresh the stream list
    } catch (err) {
      console.error('Error deleting stream:', err);
      setError('Failed to delete stream');
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
      <button className="refresh-stream-button" onClick={() => updateAllStreams()}>Refresh Streams</button> {/* Button to refresh all streams */}
      <button className="add-stream-button" onClick={() => setIsModalOpen(true)}>Add Stream</button> {/* Button to open modal */}
      <h2>RSS Streams Management</h2>
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
              <th>Link</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {streams.map((stream) => (
              <tr key={stream.id}>
                <td>{stream.link}</td>
                <td>
                  <button onClick={() => handleDeleteStream(stream.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for adding stream */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Stream">
        <form onSubmit={handleAddStream}>
          <div>
            <label>Stream Link:</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="modal-footer">
            <button type="submit">Add Stream</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RssStreamsManagerPage;
