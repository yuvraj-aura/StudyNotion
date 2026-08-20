import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCode, FaGraduationCap, FaLaptopCode, FaUsers, FaCheckCircle, FaStar } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Link to="/signup" className="hero-badge">
          <span>Become an Instructor</span>
          <FaArrowRight className="badge-arrow" />
        </Link>

        <h1 className="hero-heading">
          Empower Your Future with <span className="gradient-text">Coding Skills</span>
        </h1>

        <p className="hero-subheading">
          With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from top instructors.
        </p>

        <div className="hero-cta-group">
          <Link to="/signup" className="btn-primary">
            <span>Learn More</span>
            <FaArrowRight />
          </Link>
          <Link to="/contact" className="btn-secondary">
            Book a Demo
          </Link>
        </div>

        {/* Code Showcase Preview */}
        <div className="code-block-container">
          <div className="code-block-header">
            <div className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
            <span className="code-block-title">StudyNotion - Interactive Playground.html</span>
          </div>
          <div className="code-block-body">
            <div className="line-numbers">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
            </div>
            <pre className="code-content">
              <code>
                <span className="code-tag">&lt;!DOCTYPE html&gt;</span>{'\n'}
                <span className="code-tag">&lt;html&gt;</span>{'\n'}
                <span className="code-tag">&lt;head&gt;</span><span className="code-title">&lt;title&gt;Master Fullstack&lt;/title&gt;</span><span className="code-tag">&lt;/head&gt;</span>{'\n'}
                <span className="code-tag">&lt;body&gt;</span>{'\n'}
                {'  '}<span className="code-tag">&lt;h1&gt;</span><span className="code-string">Learn with StudyNotion</span><span className="code-tag">&lt;/h1&gt;</span>{'\n'}
                {'  '}<span className="code-tag">&lt;nav&gt;</span><span className="code-attr">&lt;a href="skills"&gt;</span>Start Coding<span className="code-attr">&lt;/a&gt;</span><span className="code-tag">&lt;/nav&gt;</span>{'\n'}
                <span className="code-tag">&lt;/body&gt;</span>{'\n'}
                <span className="code-tag">&lt;/html&gt;</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h2>5,000+</h2>
            <p>Active Students</p>
          </div>
          <div className="stat-card">
            <h2>200+</h2>
            <p>Expert Instructors</p>
          </div>
          <div className="stat-card">
            <h2>100+</h2>
            <p>Industry Courses</p>
          </div>
          <div className="stat-card">
            <h2>50+</h2>
            <p>Hiring Partners</p>
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-tag">WHY CHOOSE US</span>
          <h2>Get the skills you need for a <span className="highlight-text">job that is in demand.</span></h2>
          <p>The modern StudyNotion dictates its own terms. Today, to be a competitive specialist requires more than professional skills.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><FaLaptopCode /></div>
            <h3>Hands-on Learning</h3>
            <p>Build real-world projects and portfolio-ready software with guided code playgrounds.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><FaGraduationCap /></div>
            <h3>Industry Curriculum</h3>
            <p>Courses designed directly by engineers from Google, Amazon, Microsoft, and Meta.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><FaUsers /></div>
            <h3>1-on-1 Mentorship</h3>
            <p>Get your code reviewed, doubts cleared in live sessions, and personalized career roadmaps.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><FaCode /></div>
            <h3>Certification & Placement</h3>
            <p>Earn verified credentials and get fast-tracked into top tech company interviews.</p>
          </div>
        </div>
      </section>

      {/* Popular Tracks Preview */}
      <section className="tracks-section">
        <div className="section-header">
          <span className="section-tag">POPULAR PATHWAYS</span>
          <h2>Explore Top Learning Tracks</h2>
          <p>Structured roadmaps taking you from beginner to job-ready engineer.</p>
        </div>

        <div className="tracks-grid">
          <div className="track-card">
            <div className="track-tag beginner">Beginner Friendly</div>
            <h3>Full Stack Web Development</h3>
            <p>HTML, CSS, JavaScript, React, Node.js, Express & MongoDB.</p>
            <div className="track-meta">
              <span><FaCheckCircle className="check-icon" /> 16 Weeks</span>
              <span><FaStar className="star-icon" /> 4.9 (1.2k reviews)</span>
            </div>
          </div>

          <div className="track-card featured">
            <div className="track-tag hot">Most Popular</div>
            <h3>Data Structures & Algorithms</h3>
            <p>Master problem solving, LeetCode patterns, and technical interviews.</p>
            <div className="track-meta">
              <span><FaCheckCircle className="check-icon" /> 12 Weeks</span>
              <span><FaStar className="star-icon" /> 4.95 (2.8k reviews)</span>
            </div>
          </div>

          <div className="track-card">
            <div className="track-tag intermediate">Advanced</div>
            <h3>Cloud & DevOps Engineering</h3>
            <p>Docker, Kubernetes, AWS, CI/CD pipelines, and Terraform.</p>
            <div className="track-meta">
              <span><FaCheckCircle className="check-icon" /> 14 Weeks</span>
              <span><FaStar className="star-icon" /> 4.8 (850 reviews)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action Banner */}
      <section className="cta-banner">
        <div className="cta-box">
          <h2>Ready to start your tech journey?</h2>
          <p>Join thousands of learners transforming their careers with StudyNotion.</p>
          <div className="cta-actions">
            <Link to="/signup" className="btn-primary">Create Free Account</Link>
            <Link to="/contact" className="btn-secondary">Talk to an Advisor</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
