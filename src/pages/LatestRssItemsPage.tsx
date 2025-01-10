import React, { useEffect, useState } from 'react';
import { parseStringPromise } from 'xml2js';
import config from '../config.json'; // Importing configuration

const LatestRssItemsPage: React.FC = () => {
    const [rssItems, setRssItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(21); // Default 21 items per page
  
    useEffect(() => {
        fetchRssItems();
    }, [currentPage, itemsPerPage]);

    const fetchRssItems = async () => {
        try {
            setLoading(true); // Loading state
            
            const response = await fetch(`${config.backendAPIBaseUrl}/rss?page=${currentPage}&page_size=${itemsPerPage}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const xmlText = await response.text();
            const result = await parseStringPromise(xmlText);
            const items = result.rss.channel[0].item; // Adjust based on the actual XML structure
            setTotalPages(result.rss.total_pages); // Set total pages from the response
            if (items) {
                setRssItems(items);
            }
        } catch (err) {
            setError((err as Error).message); // Explicitly typing the error
        } finally {
            setLoading(false);
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
        if (totalPages != 0) {
            setCurrentPage(totalPages);
        } else {
            setCurrentPage(1);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div id="content">
            <div>
                <h2>Latest News</h2>
            </div>

        {loading ? ( // Show loading spinner if loading
            <p>Loading...</p>
        ) : (

            <div className="rss-items-container">
                {
                    rssItems.map((item, index) => {
                        const imageUrl = item.enclosure ? item.enclosure[0].$.url : (item['media:content'] ? item['media:content'][0].$.url : null);
                        const link = item.link[0]; // Assuming the link is available in the item
                        return (
                            <div 
                                key={index} 
                                className="feed-item" 
                                style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : 'url("./img/rss-background-612x612.png")' }}
                                onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
                            >
                                <a className="feed-item-title">{item.title[0]}</a>
                            </div>
                        );
                    })
                }
            </div>
        )}

            <div className="pagination">
                <label htmlFor="itemsPerPage">Items per page:</label>
                <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                    <option value={21}>21</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={75}>75</option>
                    <option value={100}>100</option>
                    <option value={250}>250</option>
                    <option value={500}>500</option>
                    <option value={1000}>1000</option>
                </select><br />

                <br />

                <div>
                <button onClick={handleFirstPage} disabled={currentPage === 1}>First</button> &nbsp;
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button> &nbsp;
                    <span> Page {currentPage} of {totalPages} </span>&nbsp;&nbsp;
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button> &nbsp;
                    <button onClick={handleLastPage} disabled={currentPage === totalPages}>Last</button>
                </div><br />
            </div>
        </div>
    );
};

export default LatestRssItemsPage;
