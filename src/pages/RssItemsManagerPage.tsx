import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/requestLogger'; // Updated import to use the axios instance
import '../styles.css'; // Importing consolidated CSS
import Modal from '../components/Modal'; // Importing Modal component
import config from '../config.json'; // Importing configuration

const RssItemsManagerPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  const [id, setItemId] = useState<number|null>(null);
  const [image, setItemImage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [itemsPerPage, setItemsPerPage] = useState(10); // New state for items per page
  const [editItemId, setEditItemId] = useState<number | null>(null); // State to track the item being edited

  useEffect(() => {
    fetchItems();
  }, [currentPage, itemsPerPage]); // Update effect dependencies

  const fetchItems = async () => {
    setLoading(true); // Set loading to true
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(`${config.backendAPIBaseUrl}/rss_items?page=${currentPage}&page_size=${itemsPerPage}&pubDateOrder=desc`, {
        headers: {
          Authorization: token, // Send the token without "Bearer" prefix
        },
      });
      console.log('Fetched items response:', response.data); // Log the API response
      setItems(response.data.items); // Set items from the nested property
      setTotalPages(response.data.total_pages); // Set total pages from the response
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to fetch items');
      setItems([]); // Set items to an empty array on error
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleAddItem = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!title || !link) {
      setError('Title and link are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post(`${config.backendAPIBaseUrl}/rss_items`, {
        id,
        title,
        link,
        image
      }, {
        headers: {
          Authorization: token, // Send the token without "Bearer" prefix
        },
      });
      fetchItems(); // Refresh the item list
      setItemId(null);
      setTitle('');
      setLink('');
      setItemImage('');
      setIsModalOpen(false); // Close the modal after adding
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add or update item');
    }
  };

  const handleEditItem = (id: number) => {
    const itemToEdit = items.find(item => item.id === id);
    if (itemToEdit) {
      setItemId(itemToEdit.id);
      setTitle(itemToEdit.title);
      setLink(itemToEdit.link);
      setItemImage(itemToEdit.image);
      setEditItemId(id);
      setIsModalOpen(true); // Open modal for editing
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`${config.backendAPIBaseUrl}/rss_items/${id}`, {
        headers: {
          Authorization: token, // Send the token without "Bearer" prefix
        },
      });
      fetchItems(); // Refresh the item list
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item');
    }
  };

  const handleRefreshItem = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post(`${config.backendAPIBaseUrl}/rss_items/${id}/refresh`, {
          id,
      }, {
        headers: {
          Authorization: token, // Send the token without "Bearer" prefix
        },
      });
      fetchItems(); // Refresh the item list
    } catch (err) {
      console.error('Error refreshing item:', err);
      setError('Failed to refresh item');
    }
  }

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
      <button className="add-item-button" onClick={() => setIsModalOpen(true)}>Add Item</button> {/* Button to open modal */}
      <h2>RSS Items Management</h2>
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
              <th className="image-column">Image</th>
              <th>Title</th>
              <th>Link</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  {(item.image) && (
                    <>
                      <img className="preview-image" src={item.image}></img>
                    </>
                  )}
                </td>
                <td>{item.title}</td>
                <td><a className="item-link" href={item.link} target="new">{item.link}</a></td>
                <td>
                  <button className="margin-right-10" onClick={() => handleRefreshItem(item.id)}>Refresh</button>
                  <button className="margin-right-10" onClick={() => handleEditItem(item.id)}>Edit</button>
                  <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for adding/editing item */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editItemId ? "Edit Item" : "Add Item"}>
        <form onSubmit={handleAddItem}>
          <div>
            <label>Item Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Item Link:</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Item Image:</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setItemImage(e.target.value)}
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="modal-footer">
            <button type="submit">{editItemId ? "Update Item" : "Add Item"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RssItemsManagerPage;
