import React, { useEffect, useState } from 'react'
import '../styles/parallelx.css'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'
import email from '../images/emailImg.png'
import toast from 'react-hot-toast'

const ContactUs = () => {

    const [formData, setFormData] = useState({
        email: "",
        name: "",
        subject: "",
        message: ""
    });

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    // handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // submit to backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Email Sent Successfully ✅");
                setFormData({
                    email: "",
                    name: "",
                    subject: "",
                    message: ""
                });
            }
        } catch (error) {
            toast.error("Something went wrong ❌");
            console.log(error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='marginStyle'>
                <div className="container d-flex justify-content-center align-items-center">
                    <div className="row border rounded-5 p-3 bg-white shadow box-area reverseCol">

                        <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
                            <img src={email} className="img-fluid" alt="Report" />
                        </div>

                        {/* ✅ FORM CONNECTED */}
                        <form className="col-md-6 right-box" onSubmit={handleSubmit}>

                            <h2>Contact Us</h2>
                            <p>We are here to help, available 24/7</p>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-control mb-3"
                                placeholder="Enter your Email"
                                required
                            />

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-control mb-3"
                                placeholder="Enter your Full Name"
                                required
                            />

                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="form-control mb-3"
                                placeholder="Enter Subject"
                                required
                            />

                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="form-control mb-3"
                                placeholder="Enter your Message"
                                required
                            />

                            <button
                                className="btn text-white btn-lg"
                                style={{ width: '100%', backgroundColor: 'blueviolet' }}
                                type="submit"
                            >
                                Submit Mail
                            </button>

                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ContactUs;