import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Dash/Sidebar";
import { useAuth } from "../context/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
    const [auth] = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const [emergencies, setEmergencies] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('stats');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth?.user?.role || auth.user.role !== 'admin') {
            navigate('/login');
            return;
        }

        fetchAdminData();
    }, [auth, navigate]);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const [statsRes, emergRes, incRes, usersRes] = await Promise.all([
                axios.get('https://womensecbackend.onrender.com/api/admin/stats'),
                axios.get('https://womensecbackend.onrender.com/api/admin/emergencies'),
                axios.get('https://womensecbackend.onrender.com/api/admin/incidents'),
                axios.get('https://womensecbackend.onrender.com/api/admin/users')
            ]);

            setStats(statsRes.data.stats);
            setEmergencies(emergRes.data.emergencies);
            setIncidents(incRes.data.incidents);
            setUsers(usersRes.data.users);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateIncidentStatus = async (id, status) => {
        try {
            await axios.patch(`https://womensecbackend.onrender.com/api/admin/incidents/${id}`, { status });
            fetchAdminData(); // Refresh data
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) return <div className="text-center p-5">Loading Admin Panel...</div>;

    return (
        <div className="d-flex justify-content-start">
            <Sidebar />
            <div className="container mx-3 flex-grow-1">
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="card text-white bg-primary">
                            <div className="card-body">
                                <h5>Total Emergencies</h5>
                                <h2>{stats.totalEmergencies || 0}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-success">
                            <div className="card-body">
                                <h5>Pending Incidents</h5>
                                <h2>{stats.pendingIncidents || 0}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-info">
                            <div className="card-body">
                                <h5>Approved Incidents</h5>
                                <h2>{stats.approvedIncidents || 0}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-warning">
                            <div className="card-body">
                                <h5>Total Users</h5>
                                <h2>{stats.totalUsers || 0}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
                            Stats
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'emergencies' ? 'active' : ''}`} onClick={() => setActiveTab('emergencies')}>
                            Emergencies
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'incidents' ? 'active' : ''}`} onClick={() => setActiveTab('incidents')}>
                            Incidents
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                            Users
                        </button>
                    </li>
                </ul>

                {activeTab === 'stats' && (
                    <div>Stats already shown above</div>
                )}

                {activeTab === 'emergencies' && (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Emergency No</th>
                                    <th>Map</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emergencies.map((em) => (
                                    <tr key={em._id}>
                                        <td>{em.username}</td>
                                        <td>{em.addressOfInc}</td>
                                        <td>{em.emergencyNo}</td>
                                        <td>
                                            <a href={em.mapLct} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary">View Map</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'incidents' && (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incidents.map((inc) => (
                                    <tr key={inc._id}>
                                        <td>{inc.userId?.name}</td>
                                        <td>{inc.description}</td>
                                        <td>
                                            <span className={`badge ${inc.status === 'approved' ? 'bg-success' : inc.status === 'rejected' ? 'bg-danger' : 'bg-warning'}`}>
                                                {inc.status || 'pending'}
                                            </span>
                                        </td>
                                        <td>
                                            {inc.status !== 'approved' && (
                                                <button
                                                    className="btn btn-sm btn-success me-2"
                                                    onClick={() => updateIncidentStatus(inc._id, 'approved')}
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            {inc.status !== 'rejected' && (
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => updateIncidentStatus(inc._id, 'rejected')}
                                                >
                                                    Reject
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Pincode</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.pincode}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;

