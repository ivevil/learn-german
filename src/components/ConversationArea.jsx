import React from 'react';

const ConversationArea = ({ transcript, response, isLoading, isSpeaking }) => {
  return (
    <div className="conversation-area">
      {transcript && (
        <div className="message user-message">
          <div className="message-header">
            <span className="user-icon">👤</span>
            <span className="user-label">Du</span>
          </div>
          <div className="message-content">{transcript}</div>
        </div>
      )}
      
      {isLoading && (
        <div className="message ai-message loading">
          <div className="message-header">
            <span className="ai-icon">🤖</span>
            <span className="ai-label">ChatGPT</span>
          </div>
          <div className="message-content">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
      
      {response && !isLoading && (
        <div className="message ai-message">
          <div className="message-header">
            <span className="ai-icon">🤖</span>
            <span className="ai-label">ChatGPT {isSpeaking && <span className="speaking-indicator">🔊</span>}</span>
          </div>
          <div className="message-content">{response}</div>
        </div>
      )}
    </div>
  );
};

export default ConversationArea; 