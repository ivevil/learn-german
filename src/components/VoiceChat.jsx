import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';
import ModeToggle from './ModeToggle';
import ConversationArea from './ConversationArea';
import VoiceControls from './VoiceControls';
import TextControls from './TextControls';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const VoiceChat = () => {
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(true);

  // Get available voices on component mount
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const germanVoice = voices.find(voice => 
        voice.lang.startsWith('de') && voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.startsWith('de'));
      
      if (germanVoice) {
        console.log('German voice found:', germanVoice.name);
      }
    };

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    loadVoices();
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      setIsListening(false);
      await sendToGPT(spokenText);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const sendToGPT = async (text) => {
    setIsLoading(true);
    try {
      const res = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { 
            role: 'system', 
            content: 'Du bist ein freundlicher Deutschlehrer. Antworte in kurzen, verständlichen Sätzen auf Deutsch. Sprich natürlich und hilfreich.' 
          },
          { role: 'user', content: text }
        ],
      });
      const reply = res.choices[0].message.content;
      setResponse(reply);
      
      // Only speak if in voice mode
      if (isVoiceMode) {
        speak(reply);
      }
    } catch (err) {
      console.error('OpenAI error:', err);
      const errorMessage = 'Entschuldigung, es gab einen Fehler. Bitte versuche es erneut.';
      setResponse(errorMessage);
      if (isVoiceMode) {
        speak(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const germanVoice = voices.find(voice => 
      voice.lang.startsWith('de') && voice.name.includes('Google')
    ) || voices.find(voice => voice.lang.startsWith('de'));
    
    if (germanVoice) {
      utterance.voice = germanVoice;
    }
    
    setIsSpeaking(true);
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleTextSubmit = async (text) => {
    setTranscript(text);
    await sendToGPT(text);
  };

  const toggleMode = () => {
    setIsVoiceMode(!isVoiceMode);
    if (isSpeaking) {
      stopSpeaking();
    }
    setTranscript('');
    setResponse('');
  };

  return (
    <div className="voice-chat">
      <ModeToggle 
        isVoiceMode={isVoiceMode} 
        onToggle={toggleMode} 
      />

      <div className="chat-container">
        <ConversationArea 
          transcript={transcript}
          response={response}
          isLoading={isLoading}
          isSpeaking={isSpeaking}
        />
        
        <div className="controls">
          {isVoiceMode ? (
            <VoiceControls 
              isListening={isListening}
              isSpeaking={isSpeaking}
              onStartListening={startListening}
              onStopSpeaking={stopSpeaking}
            />
          ) : (
            <TextControls 
              onSubmit={handleTextSubmit}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;
