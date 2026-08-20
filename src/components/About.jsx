import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaLightbulb, FaHeart, FaRocket, FaGlobe, FaShieldAlt } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Header Banner */}
      <section className="about-hero">
        <span className="about-badge">ABOUT US</span>
        <h1 className="about-title">
          Driving Innovation in Online Education for a <span className="highlight-yellow">Brighter Future</span>
        </h1>
        <p className="about-subtitle">
          StudyNotion is at the forefront of driving innovation in online education. We're passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.
        </p>
      </section>

      {/* Quote Banner */}
      <section className="quote-section">
        <div className="quote-box">
          <p>
            " We are passionate about revolutionizing the way we learn. Our innovative platform combines technology, expertise, and community to create an unparalleled educational experience. "
          </p>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="mission-vision-section">
        <div className="story-grid">
          <div className="story-card">
            <div className="story-icon red"><FaLightbulb /></div>
            <h2>Our Founding Story</h2>
            <p>
              Our e-learning platform was born out of a shared vision and a passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.
            </p>
            <p>
              As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom.
            </p>
          </div>

          <div className="story-card">
            <div className="story-icon blue"><FaRocket /></div>
            <h2>Our Vision & Mission</h2>
            <p>
              With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners.
            </p>
            <p>
              Our vision is to empower individuals from all backgrounds to unlock their full potential and shape a brighter future through continuous skill acquisition and mentorship.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="values-section">
        <div className="section-header">
          <span className="section-tag">OUR VALUES</span>
          <h2>The Principles That Drive Everything We Do</h2>
        </div>

        <div className="values-grid">
          <div className="value-item">
            <div className="value-icon"><FaGraduationCap /></div>
            <h3>Quality Education</h3>
            <p>Delivering high-caliber curriculum crafted by industry pioneers and top educators.</p>
          </div>

          <div className="value-item">
            <div className="value-icon"><FaGlobe /></div>
            <h3>Accessibility for All</h3>
            <p>Making world-class learning affordable and available to anyone, anywhere.</p>
          </div>

          <div className="value-item">
            <div className="value-icon"><FaShieldAlt /></div>
            <h3>Integrity & Trust</h3>
            <p>Providing transparent, verified credentials and honest mentorship feedback.</p>
          </div>

          <div className="value-item">
            <div className="value-icon"><FaHeart /></div>
            <h3>Community First</h3>
            <p>Fostering an inclusive space where students collaborate, share, and grow together.</p>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="about-stats-section">
        <div className="about-stats-grid">
          <div>
            <h3>5K+</h3>
            <p>Active Students</p>
          </div>
          <div>
            <h3>10+</h3>
            <p>Mentors</p>
          </div>
          <div>
            <h3>200+</h3>
            <p>Courses</p>
          </div>
          <div>
            <h3>50+</h3>
            <p>Awards & Recognition</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
