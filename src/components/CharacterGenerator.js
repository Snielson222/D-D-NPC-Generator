import React, { useState } from 'react';
import axios from 'axios';
import CharacterChat from './CharacterChat';

// Basic arrays for race and class
const races = ["Elf", "Dwarf", "Human", "Halfling", "Dragonborn"];
const classes = ["Fighter", "Rogue", "Wizard", "Cleric", "Bard"];

// Generate a random value between 8-18 for D&D stats
const generateStat = () => Math.floor(Math.random() * 11) + 8;

const CharacterGenerator = () => {
  const [character, setCharacter] = useState(null);

  const generateCharacter = async () => {
    // Randomly select race and class
    const race = races[Math.floor(Math.random() * races.length)];
    const classType = classes[Math.floor(Math.random() * classes.length)];

    // Generate character stats
    const stats = {
      Strength: generateStat(),
      Dexterity: generateStat(),
      Constitution: generateStat(),
      Intelligence: generateStat(),
      Wisdom: generateStat(),
      Charisma: generateStat()
    };

    // Call OpenAI API for backstory
    const prompt = `Create a backstory for a ${race} ${classType} character in Dungeons & Dragons.`;
    const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;

    const backstory = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 50,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    ).then(response => response.data.choices[0].text.trim())
     .catch(() => "A mysterious background...");

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
      <button onClick={generateCharacter}>Generate NPC</button>
      {character && (
        <div>
          <h2>{character.race} {character.class}</h2>
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
