import React, { useState } from 'react';

const TextControls = ({ onSubmit, isLoading }) => {
  const [textInput, setTextInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      onSubmit(textInput);
      setTextInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-input-form">
      <div className="text-input-container">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Schreibe deine Nachricht auf Deutsch..."
          className="text-input"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!textInput.trim() || isLoading}
        >
          📤 Senden
        </button>
      </div>
    </form>
  );
};

export default TextControls; 