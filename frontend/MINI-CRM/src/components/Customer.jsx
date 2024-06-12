// src/components/CustomerTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerTable.css';

const CustomerTable = () => {
    const [customers, setCustomers] = useState([]);
    const [filters, setFilters] = useState({
        totalSpends: false,
        maxVisits: false,
        lastVisits: false,
    });

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/admin/customers', { withCredentials: true });
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    };

    const fetchFilteredCustomers = async () => {
        const rules = [];
        if (filters.totalSpends) {
            rules.push({ field: 'totalSpends', condition: '>', value: 10000 });
        }
        if (filters.maxVisits) {
            rules.push({ field: 'visits', condition: '<=', value: 3 });
        }
        if (filters.lastVisits) {
            rules.push({ field: 'lastVisits', condition: '<', value: new Date(new Date().setMonth(new Date().getMonth() - 3)) });
        }

        try {
            const response = await axios.post('http://localhost:3000/api/v1/campaign/check-audience-size', {
                rules,
                operator: 'AND',
            }, { withCredentials: true });
            setCustomers(response.data.audience);
        } catch (error) {
            console.error('Error fetching filtered customer data:', error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (filters.totalSpends || filters.maxVisits || filters.lastVisits) {
            fetchFilteredCustomers();
        } else {
            fetchCustomers();
        }
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, checked } = e.target;
        setFilters({ ...filters, [name]: checked });
    };

    return (
        <div className="customer-table-container">
            <h1>Customer Details</h1>
            <div className="filters">
                <label>
                    <input
                        type="checkbox"
                        name="totalSpends"
                        checked={filters.totalSpends}
                        onChange={handleFilterChange}
                    />
                    Total Spends greater than 10000
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="maxVisits"
                        checked={filters.maxVisits}
                        onChange={handleFilterChange}
                    />
                    Max Visits less than equal to 3
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="lastVisits"
                        checked={filters.lastVisits}
                        onChange={handleFilterChange}
                    />
                    Not Visited in Last 3 Months
                </label>
            </div>
            <table className="customer-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Last Visits</th>
                        <th>Max Visits</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer._id}>
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phone_No}</td>
                            <td>
                                {customer.lastVisits.map((visit, index) => (
                                    <div key={index}>{new Date(visit).toLocaleString()}</div>
                                ))}
                            </td>
                            <td>{customer.maxVisits}</td>
                            <td>{new Date(customer.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerTable;