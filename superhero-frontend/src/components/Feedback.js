import React, { useState } from 'react';
import './Feedback.css'; // Assuming you have this styled similarly to the other pages

const Feedback = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState(''); // New state for surname
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = {
      name,
      surname, // Include surname
      email,
      message: feedback
    };

    try {
      const response = await fetch('http://localhost:3001/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        setMessage('Thank you for your feedback!');
        setName('');
        setSurname(''); // Reset surname
        setEmail('');
        setFeedback('');
      } else {
        setMessage('Error submitting feedback, please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessage('Error submitting feedback, please try again.');
    }
  };

  return (
    <div>
      <div className="navbar-container">
          <nav className="navbar">
            <h1 className="navbar-title">Superhero & Villain Hub</h1>
            <ul className="navbar-links">
              <li><a href="/">Home</a></li>
              <li><a href="/Characters">Characters</a></li>
              <li><a href="/About">About</a></li>
            </ul>
          </nav>
        </div>
      <div className="page-container">
        {/* Feedback Form Container */}
        <div className="feedback-container">
          <h2>We Value Your Feedback!</h2>
          <p className="motivation-text">
            Your opinion matters to us! Let us know what you think about our site, your favorite superheroes, or any improvements we can make to enhance your experience. Fill out the form below, and help us create the best superhero hub out there!
          </p>
          <form onSubmit={handleSubmit}>
            {/* Name and Surname side by side */}
            <div className="form-group name-surname-group">
              <div className="name-input">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="surname-input">
                <label htmlFor="surname">Surname:</label>
                <input
                  type="text"
                  id="surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Your Surname"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="feedback">Message:</label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Your Feedback"
                rows="5"
                required
              />
            </div>
            <button type="submit" className="submit-btn">Submit</button>
          </form>
          {message && <p className="thank-you-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Feedback;