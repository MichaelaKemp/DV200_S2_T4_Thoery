import React, { useState } from 'react';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple feedback submit logic (you can later connect this to a backend or API)
    setMessage('Thank you for your feedback!');
    setFeedback('');
  };

  return (
    <div>
      <h2>Feedback</h2>
      <form onSubmit={handleSubmit}>
        <textarea 
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Leave your feedback here"
          rows="5"
          cols="50"
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Feedback;