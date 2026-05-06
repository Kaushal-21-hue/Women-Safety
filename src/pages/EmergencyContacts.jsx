import React from 'react';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import EmergencyContactsManager from '../Components/EmergencyContacts/EmergencyContactsManager';
import '../styles/sos-contacts.css'; // Reuse existing styles if applicable

const EmergencyContacts = () => {
    return (
        <>
            <Navbar />
            <div className="marginStyle container my-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10">
                        <div className="d-flex align-items-center mb-4">
                            <h2 className="mb-0">Emergency Contacts Manager</h2>
                        </div>
                        <EmergencyContactsManager />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default EmergencyContacts;

