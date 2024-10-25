import React, { useState } from 'react';
import axios from 'axios';
import CharacterChat from './CharacterChat';

// Basic arrays for race and class
const races = ["Elf", "Dwarf", "Human", "Halfling", "Dragonborn"];
const classes = ["Fighter", "Rogue", "Wizard", "Cleric", "Bard"];

// Generate a random value between 8-18 for D&D stats
const generateStat = () => Math.floor(Math.random() * 11) + 8;

console.log("API Key:", process.env.REACT_APP_OPENAI_API_KEY);

const CharacterGenerator = () => {
  const [character, setCharacter] = useState(null);
  const [level, setLevel] = useState(1);

  const generateCharacter = async () => {
    // Randomly select race and class
    const race = races[Math.floor(Math.random() * races.length)];
    const classType = classes[Math.floor(Math.random() * classes.length)];

    // Generate character stats with level adjustments
    const stats = {
      Strength: generateStat() + level,
      Dexterity: generateStat() + level,
      Constitution: generateStat() + level,
      Intelligence: generateStat() + level,
      Wisdom: generateStat() + level,
      Charisma: generateStat() + level
    };

    // More detailed prompt for a richer backstory
    const prompt = `Generate a rich backstory for a D&D character. The character is a ${race} ${classType}. Include details about their personality, motivations, and a notable event in their past.`;
    
    const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;

    const backstory = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-3.5-turbo",
        prompt: prompt,
        max_tokens: 80,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    ).then(response => response.data.choices[0].text.trim())
     .catch(() => "A most mysterious background...");

    // Set the character state with all generated data
    setCharacter({
      race,
      class: classType,
      stats,
      backstory
    });
  };

  return (
    <div>
      <h1>D&D NPC Generator</h1>
      <label>
        Select Level:
        <select value={level} onChange={(e) => setLevel(Number(e.target.value))}>
          {Array.from({ length: 20 }, (_, i) => i + 1).map(lvl => (
            <option key={lvl} value={lvl}>{lvl}</option>
          ))}
        </select>
      </label>
      <button onClick={generateCharacter}>Generate NPC</button>
      
      {character && (
        <div>
          <h2>{character.race} {character.class} - Level {level}</h2>
          <p><strong>Backstory:</strong> {character.backstory}</p>
          <h3>Character Stats:</h3>
          <ul>
            {Object.entries(character.stats).map(([stat, value]) => (
              <li key={stat}>{stat}: {value}</li>
            ))}
          </ul>
          <CharacterChat character={character} />
        </div>
      )}
    </div>
  );
};

export default CharacterGenerator;
