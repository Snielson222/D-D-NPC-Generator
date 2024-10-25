import React, { useState } from 'react';
import axios from 'axios';

const CharacterChat = ({ character }) => {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();

    const newUserMessage = { user: "Player", text: chatInput };
    setChatHistory([...chatHistory, newUserMessage]);

    const prompt = `You are ${character.race} ${character.class} named with the backstory: ${character.backstory}. Respond to: "${chatInput}"`;
    const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;

    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 30,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    ).then(res => res.data.choices[0].text.trim())
     .catch(() => "The NPC seems lost in thought...");

    const newNpcMessage = { user: "NPC", text: response };
    setChatHistory([...chatHistory, newUserMessage, newNpcMessage]);
    setChatInput('');
  };

  return (
    <div>
      <h3>Chat with NPC</h3>
      <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', height: '150px', overflowY: 'auto' }}>
        {chatHistory.map((message, index) => (
          <p key={index}><strong>{message.user}:</strong> {message.text}</p>
        ))}
      </div>
      <form onSubmit={handleChatSubmit}>
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Say something to the NPC..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default CharacterChat;