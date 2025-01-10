import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axiosInstance from '../utils/requestLogger'; // Updated import to use the axios instance
import config from '../config.json'; // Importing configuration

Chart.register(...registerables);

const DashboardPage: React.FC = () => {
  const [feedPullFrequency, setFeedPullFrequency] = useState<number[]>([]);
  const [totalFeeds, setTotalFeeds] = useState<number>(0);
  const [userDownloadFrequency, setUserDownloadFrequency] = useState<number[]>([]);
  const [itemCount, setItemCount] = useState<number>(0); // New state for item count


  useEffect(() => {
    // Fetch metrics data from the backend
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('token');

        const axiosConfig = {
          headers: {
            'Authorization': token
          }
        }
        const feedPullResponse = await axiosInstance.get(`${config.backendAPIBaseUrl}/metrics/feed-pull-frequency`, axiosConfig);
        const totalFeedsResponse = await axiosInstance.get(`${config.backendAPIBaseUrl}/metrics/total-feeds`, axiosConfig);
        const userDownloadResponse = await axiosInstance.get(`${config.backendAPIBaseUrl}/metrics/user-download-frequency`, axiosConfig);
        const itemCountResponse = await axiosInstance.get(`${config.backendAPIBaseUrl}/metrics/item-count`, axiosConfig);

        const feedPullData = await feedPullResponse.data;
        const totalFeedsData = await totalFeedsResponse.data;
        const userDownloadData = await userDownloadResponse.data;
        const itemCountData = await itemCountResponse.data;

        setFeedPullFrequency(feedPullData.accessCounts);
        setTotalFeeds(totalFeedsData.total);
        setUserDownloadFrequency(userDownloadData.downloadCounts);
        setItemCount(itemCountData.count);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  const feedPullChartData = {
    labels: feedPullFrequency.map((_, index) => `Time ${index + 1}`),
    datasets: [
      {
        label: 'Feed Pull Frequency',
        data: feedPullFrequency,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const userDownloadChartData = {
    labels: userDownloadFrequency.map((_, index) => `Time ${index + 1}`),
    datasets: [
      {
        label: 'User Download Frequency',
        data: userDownloadFrequency,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  return (
    <div id="content">
      <h2>Dashboard</h2>
      <div>
        <div>
          <h3>Feeds Processed: {totalFeeds}</h3>
          <h3>Feed Items: {itemCount}</h3>
          <div className="graphs" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ flex: 2 }}>
              <Bar data={feedPullChartData} options={{ maintainAspectRatio: false }} />
            </div>
            <div style={{ flex: 2 }}>
              <Bar data={userDownloadChartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
