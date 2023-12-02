import React, { useEffect, useState } from 'react'
import './style/Home.css'
import axios from 'axios'


// set data
const Home = () => {
    const [data, setData] = useState([])
    const [editableid, setEditableid] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [searchQuery, setSearchQuery] = useState('')
    const [activeSearch, setActiveSearch] = useState(false);
    const [selectedEntries, setSelectedEntries] = useState([]);
    // fetch data from API

    const fetchData = async () => {
        try {
            const response = await axios.get(
                "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
            );

            const filteredData = response.data.filter((item) =>
                Object.values(item).some((value) =>
                    value.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
            setData(activeSearch ? filteredData : response.data);
            setActiveSearch(false)
        } catch (error) {
            console.error("Error fetching data:", error);
        }

    };
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (activeSearch) {
            fetchData();
            setActiveSearch(false);
        }
    }, [searchQuery, activeSearch]);


    const EditData = (id) => {
        setEditableid(id)
    }

    const handleInputChange = (id, key, value) => {
        // Update the local state for the edited field
        setData((prevData) => {
            return prevData.map((item) =>
                item.id === id ? { ...item, [key]: value } : item
            );
        });
    };

    const handleSave = (id) => {
        setEditableid(null)
    }

    const handleDelete = (id) => {
        setData((prevData) => prevData.filter((item) => item.id !== id))
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    const handleButtonClick = () => {
        setActiveSearch(true)
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            setActiveSearch(true)

        }
    };

    const handleCheckboxChange = (id) => {
        setSelectedEntries((prevSelection) => {
            if (prevSelection.includes(id)) {
                return prevSelection.filter((selectedId) => selectedId !== id);
            } else {
                return [...prevSelection, id];
            }
        });
    };

    const handleDeleteSelected = () => {
        setData((prevData) => prevData.filter((item) => !selectedEntries.includes(item.id)));
        setSelectedEntries([]);
    };

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedRows = data.slice(startIndex, endIndex);

    return (
        <div>
            <div>
                <input
                    className='search'
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button className='sbutton' onClick={handleButtonClick}>Search</button>
            </div>
            {data.length > 0 ? (
                <div>
                    <table>
                        <thead>
                            <tr className='str'>
                                <th>Select</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedRows.map((item) => {
                                return <tr className='std' key={item.id} style={{
                                    backgroundColor: selectedEntries.includes(item.id) ? '#f0f0f0' : 'inherit',
                                }} >
                                    <td className='tdd' >
                                        <input type='checkbox' style={{ margin: 45 }}
                                            checked={selectedEntries.includes(item.id)}
                                            onChange={() => handleCheckboxChange(item.id)}
                                        />
                                    </td>
                                    <td className='tdd' >
                                        {
                                            editableid === item.id ? (
                                                <input className='inn' type='text' value={item.name}
                                                    onChange={(e) => handleInputChange(item.id, 'name', e.target.value)} />
                                            ) : item.name
                                        }
                                    </td>
                                    <td className='tdd'> {
                                        editableid === item.id ? (
                                            <input className='inn' type='email' value={item.email}
                                                onChange={(e) => handleInputChange(item.id, 'email', e.target.value)} />
                                        ) : item.email
                                    } </td>
                                    <td className='tdd'> {
                                        editableid === item.id ? (
                                            <input className='inn' type='text' value={item.role}
                                                onChange={(e) => handleInputChange(item.id, 'role', e.target.value)} />
                                        ) : item.role
                                    } </td>
                                    <td className='tdd' >
                                        {
                                            editableid === item.id ? (
                                                <button className='btn' onClick={() => handleSave(item.id)}>Save</button>
                                            ) : <button className='btn' onClick={() => EditData(item.id)}>Edit</button>
                                        }
                                        <button className='btn' onClick={() => handleDelete(item.id)}>Delete</button>
                                    </td>
                                </tr>
                            })
                            }
                        </tbody>
                    </table>
                    <div className='flx'>
                        <div>
                            <button className='sel' onClick={handleDeleteSelected} disabled={selectedEntries.length === 0}>
                                Delete Selected
                            </button>
                        </div>
                        <div className='nav'>
                            <button className='navp' onClick={handleFirstPage} disabled={currentPage === 1}>
                                First
                            </button>
                            <button className='navp' onClick={handlePrevPage} disabled={currentPage === 1}>
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button className='navp'
                                    key={index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                    disabled={currentPage === index + 1}>
                                    {index + 1}
                                </button>
                            ))}

                            <button className='navp' onClick={handleNextPage} disabled={currentPage === totalPages}>
                                Next
                            </button>
                            <button className='navp' onClick={handleLastPage} disabled={currentPage === totalPages}>
                                Last
                            </button>

                        </div>
                    </div>
                </div>
            ) : (
                <p>No entry found related to this search</p>
            )
            }
        </div >

    )
}
export default Home