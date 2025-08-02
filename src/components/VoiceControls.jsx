import React from 'react';

const VoiceControls = ({ isListening, isSpeaking, onStartListening, onStopSpeaking }) => {
  return (
    <>
      <button 
        onClick={onStartListening}
        disabled={isListening || isSpeaking}
        className={`mic-button ${isListening ? 'listening' : ''}`}
      >
        {isListening ? '🎤 Höre zu...' : '🎤 Start Talking'}
      </button>
      
      {isSpeaking && (
        <button 
          onClick={onStopSpeaking}
          className="stop-button"
        >
          🔇 Stop Speaking
        </button>
      )}
    </>
  );
};

export default VoiceControls; 