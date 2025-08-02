import React from 'react';

const ModeToggle = ({ isVoiceMode, onToggle }) => {
  return (
    <div className="mode-toggle">
      <div className="toggle-container">
        <button 
          onClick={onToggle}
          className={`toggle-switch ${isVoiceMode ? 'voice-active' : 'text-active'}`}
          aria-label={`Switch to ${isVoiceMode ? 'text' : 'voice'} mode`}
        >
          <div className="toggle-track">
            <div className="toggle-thumb">
              <span className="toggle-icon">
                {isVoiceMode ? '🎤' : '📝'}
              </span>
            </div>
          </div>
          <div className="toggle-labels">
            <span className={`toggle-label ${isVoiceMode ? 'active' : ''}`}>
              Voice
            </span>
            <span className={`toggle-label ${!isVoiceMode ? 'active' : ''}`}>
              Text
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ModeToggle; 