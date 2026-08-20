import React, { useState } from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    message: ''
  });

  const changeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    toast.success('Thank you for reaching out! We will contact you shortly.');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNo: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      <div className="contact-container-grid">
        {/* Left Side: Contact Information Cards */}
        <div className="contact-info-col">
          <div className="info-card">
            <div className="info-icon"><FaEnvelope /></div>
            <div>
              <h3>Chat with us</h3>
              <p>Our friendly team is here to help.</p>
              <span className="info-detail">support@studynotion.com</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon"><FaMapMarkerAlt /></div>
            <div>
              <h3>Visit our office</h3>
              <p>Come say hello at our headquarters.</p>
              <span className="info-detail">Connaught Place, New Delhi, India</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon"><FaPhoneAlt /></div>
            <div>
              <h3>Call us</h3>
              <p>Mon-Fri from 9am to 6pm IST.</p>
              <span className="info-detail">+91 (11) 2345-6789</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon"><FaClock /></div>
            <div>
              <h3>Response Time</h3>
              <p>We usually get back within 24 hours.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Contact Form */}
        <div className="contact-form-col">
          <div className="form-header">
            <h2>Got an Idea? We've got the skills. Let's team up.</h2>
            <p>Tell us more about yourself and what you've got in mind.</p>
          </div>

          <form onSubmit={submitHandler} className="styled-contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={changeHandler}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={changeHandler}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={changeHandler}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNo">Phone Number</label>
              <input
                type="tel"
                name="phoneNo"
                id="phoneNo"
                placeholder="Enter 10-digit mobile number"
                value={formData.phoneNo}
                onChange={changeHandler}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                name="message"
                id="message"
                rows="4"
                placeholder="Enter your message here..."
                value={formData.message}
                onChange={changeHandler}
                required
              ></textarea>
            </div>

            <button type="submit" className="contact-submit-btn">
              <span>Send Message</span>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
