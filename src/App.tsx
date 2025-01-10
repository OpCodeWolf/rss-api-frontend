import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate for redirection
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserManagerPage from './pages/UserManagerPage';
import RssStreamsManagerPage from './pages/RssStreamsManagerPage';
import RssItemsManagerPage from './pages/RssItemsManagerPage';
import LatestRssItemsPage from './pages/LatestRssItemsPage'; // Importing the new page
import Navbar from './components/Navbar';
import FilterItemsManagerPage from './pages/FilterItemsManagerPage';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Navbar openModal={openModal} />
      <LoginPage isModalOpen={isModalOpen} closeModal={closeModal} />
      <Routes>
        <Route path="/" element={<Navigate to="/latest-rss-items" />} /> {/* Redirect to latest-rss-items */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/user-manager" element={<UserManagerPage />} />
        <Route path="/rss-streams" element={<RssStreamsManagerPage />} />
        <Route path="/rss-items" element={<RssItemsManagerPage />} /> {/* Added route for RSS Items Manager */}
        <Route path="/filter-items" element={<FilterItemsManagerPage />} /> {/* Added route for Filter Items Manager */}
        <Route path="/latest-rss-items" element={<LatestRssItemsPage />} /> {/* Added route for Latest RSS Items */}
      </Routes>
    </>
  );
};

export default App;
