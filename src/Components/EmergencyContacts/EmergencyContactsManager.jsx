import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import { FaTrash, FaPlus, FaPhone, FaUserPlus, FaCheckSquare, FaComment, FaWhatsapp, FaUserCircle } from "react-icons/fa";

const EmergencyContactsManager = ({ onSelectionChange }) => {
    const [auth, , authLoading] = useAuth();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newContact, setNewContact] = useState({
        name: "",
        phone: "",
        relationship: "Friend",
    });
    const [selectedIds, setSelectedIds] = useState([]);

    // Update parent when selection changes
    useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange(selectedIds);
        }
    }, [selectedIds, onSelectionChange]);

    // Fetch contacts
    const fetchContacts = async () => {
        // Wait for auth to fully load before making API call
        if (authLoading || !auth?.user?._id || !auth?.token) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:5000/api/v1/emergency/contacts/${auth.user._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                }
            );

            // Handle 401 Unauthorized
            if (res.status === 401) {
                toast.error("Session expired. Please login again.");
                setLoading(false);
                return;
            }

            const data = await res.json();
            if (data.success) {
                setContacts(data.contacts || []);
            }
        } catch (error) {
            console.error("Error fetching contacts:", error);
            toast.error("Failed to load contacts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [auth?.user?._id, auth?.token, authLoading, fetchContacts]);

    // Add contact
    const handleAddContact = async (e) => {
        e.preventDefault();
        if (!newContact.name || !newContact.phone) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/v1/emergency/contacts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
                body: JSON.stringify({
                    userId: auth.user._id,
                    name: newContact.name,
                    phone: newContact.phone,
                    relationship: newContact.relationship,
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Contact added successfully!");
                setShowForm(false);
                setNewContact({ name: "", phone: "", relationship: "Friend" });
                fetchContacts();
            } else {
                toast.error(data.message || "Failed to add contact");
            }
        } catch (error) {
            console.error("Error adding contact:", error);
            toast.error("Error adding contact");
        }
    };

    // Delete contact
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this contact?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/v1/emergency/contacts/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Contact deleted!");
                fetchContacts();
            } else {
                toast.error(data.message || "Failed to delete");
            }
        } catch (error) {
            console.error("Error deleting contact:", error);
            toast.error("Error deleting contact");
        }
    };

    if (!auth?.token) {
        return (
            <div className="text-center py-4">
                <p className="text-muted">Please login to manage emergency contacts</p>
            </div>
        );
    }

    return (
        <div className="card shadow-sm">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                    <FaUserPlus className="me-2" />
                    Emergency Contacts
                </h5>
                <button
                    className="btn btn-light btn-sm"
                    onClick={() => setShowForm(!showForm)}
                >
                    <FaPlus /> Add
                </button>
            </div>

            <div className="card-body">
                {/* Add Contact Form */}
                {showForm && (
                    <form onSubmit={handleAddContact} className="mb-4 p-3 bg-light rounded">
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Contact name"
                                value={newContact.name}
                                onChange={(e) =>
                                    setNewContact({ ...newContact, name: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                className="form-control"
                                placeholder="+91xxxxxxxxxx"
                                value={newContact.phone}
                                onChange={(e) =>
                                    setNewContact({ ...newContact, phone: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Relationship</label>
                            <select
                                className="form-control"
                                value={newContact.relationship}
                                onChange={(e) =>
                                    setNewContact({ ...newContact, relationship: e.target.value })
                                }
                            >
                                <option value="Friend">Friend</option>
                                <option value="Family">Family</option>
                                <option value="Parent">Parent</option>
                                <option value="Sibling">Sibling</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Colleague">Colleague</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary">
                                <FaPlus className="me-1" /> Add Contact
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Contact List */}
                {loading ? (
                    <div className="text-center py-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                        <p>No emergency contacts added yet.</p>
                        <p className="small">Add contacts to notify them during emergency.</p>
                    </div>
                ) : (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">
                                {selectedIds.length} / {contacts.length} selected for SOS
                            </span>
                            <div>
                                <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => setSelectedIds([])}>
                                    Clear All
                                </button>
                                <button className="btn btn-outline-primary btn-sm" onClick={() => setSelectedIds(contacts.map(c => c._id))}>
                                    Select All
                                </button>
                            </div>
                        </div>
                        <div className="row g-3">
                            {contacts.map((contact) => {
                                const isSelected = selectedIds.includes(contact._id);
                                return (
                                    <div key={contact._id} className="col-md-6 col-lg-4">
                                        <div className={`card h-100 shadow-sm border-${isSelected ? 'danger' : 'light'} sos-contact-card ${isSelected ? 'selected' : ''}`}>
                                            <div className="card-body">
                                                <div className="d-flex align-items-start mb-3">
                                                    <div className="me-3">
                                                        <FaUserCircle size={40} className="text-muted" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h6 className="card-title mb-1">{contact.name}</h6>
                                                        <span className={`badge bg-${contact.relationship === 'Family' ? 'danger' : contact.relationship === 'Friend' ? 'info' : 'secondary'} mb-2`}>
                                                            {contact.relationship}
                                                        </span>
                                                        <p className="mb-0 small text-muted">{contact.phone}</p>
                                                    </div>
                                                    <label className="form-check-label ms-2" style={{ cursor: 'pointer' }}>
                                                        <FaCheckSquare
                                                            size={24}
                                                            className={`text-${isSelected ? 'danger' : 'light'} select-checkbox`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const newSelected = isSelected
                                                                    ? selectedIds.filter(id => id !== contact._id)
                                                                    : [...selectedIds, contact._id];
                                                                setSelectedIds(newSelected);
                                                            }}
                                                        />
                                                    </label>
                                                </div>

                                                <div className="d-flex gap-1 flex-wrap">
                                                    {/* Call */}
                                                    <a href={`tel:${contact.phone}`} className="btn btn-success btn-sm flex-fill" title="Call">
                                                        <FaPhone />
                                                    </a>

                                                    {/* WhatsApp */}
                                                    <a
                                                        href={`https://wa.me/91${contact.phone.replace(/[^0-9]/g, '').slice(-10)}?text=🚨%20EMERGENCY!%20I%20need%20help%20now.%20Location:%20https://maps.google.com`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-success btn-sm flex-fill"
                                                        title="WhatsApp"
                                                    >
                                                        <FaWhatsapp />
                                                    </a>

                                                    {/* SMS Test */}
                                                    <button
                                                        className="btn btn-info btn-sm flex-fill"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // Test SMS to this contact
                                                            fetch('http://localhost:5000/api/v1/emergency/send', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({
                                                                    to: contact.phone,
                                                                    message: '🚨 Test Emergency Alert! Location: https://maps.google.com'
                                                                })
                                                            }).then(res => res.json()).then(data => {
                                                                toast.success(data.message || 'SMS test sent');
                                                            }).catch(() => toast.error('SMS test failed'));
                                                        }}
                                                        title="Test SMS"
                                                    >
                                                        <FaComment />

                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(contact._id);
                                                        }}
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {contacts.length > 0 && selectedIds.length === 0 && (
                    <div className="mt-3 text-center text-danger fw-bold">
                        💡 <small>Select contacts using checkboxes, then activate SOS above!</small>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmergencyContactsManager;
