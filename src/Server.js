const cors = require('cors');
const express = require('express');
const dictionary = require('./components/Dictionary');

const PORT = 3001;
const app = express();

function normalizeString(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function compareWords(word1, word2) {
  word1 = normalizeString(word1);
  word2 = normalizeString(word2);

  if (word1.length !== 5 || word2.length !== 5) {
    throw new Error("Both words must be exactly 5 characters long.");
  }

  const result = [];
  const word1Array = word1.split('');
  const word2Array = word2.split('');

  // Create an array to track the characters that have been matched
  const matched = new Array(5).fill(false);

  // First pass: Check for 'green' matches
  for (const i in word1Array) {
    if (word1Array[i] === word2Array[i]) {
      result[i] = 'green';
      matched[i] = true;
      continue;
    }

    result[i] = false;
  }

  // Second pass: Check for 'yellow' matches
  for (const i in result) {
    if (result[i] == 'green') continue;
    if (!word1Array.includes(word2Array[i])) continue;

    // Check if the character hasn't been matched already
    let isYellow = false;
    for (const j in result) {
      if (word1Array[j] === word2Array[i] && !matched[j]) {
        isYellow = true;
        matched[j] = true; // Mark as matched to prevent duplicate 'yellow'
        break;
      }
    }
    if (isYellow) result[i] = 'yellow';
  }

  return result;
}

process.stdout.write('Carregando back... ');

dictionary.then(dict => {

  console.log('OK');

  let secretWord;
  let rooms = [];

  app.use(cors());

  // Rooms logic
  app.get('/newRoom', (req, res) => {

    let room;
    for (let tries = 0; tries < 10; tries++) {
        room = Math.random().toString(36).substring(7);
        if (!rooms.includes(room)) {
            rooms.push({room, players: []});
            return res.json({ room });
        }
    }

    // Todo: expire rooms

    res.json({ error: 'Failed to create room' });
  });

  app.get('/joinRoom', (req, res) => {
    const room = req.query.room;
    const filter = rooms.filter(r => r.room === room);

    if (!filter.length) return res.json({ error: 'Room not found' });
    if (!filter.players.length >= 2) return res.json({ error: 'Room is full' });

    res.json({ room, success: true });
  });

  app.get('/newRoomWord', (req, res) => {
    const room = req.query.room;
    const filter = rooms.filter(r => r.room === room);

    if (!filter.length) return res.json({ error: 'Room not found' });

    const word = dict.random().toUpperCase();

    filter[0].word = word;
    console.log('New word', word, 'for room', room);

    res.json({ success: true });
  });

  app.get('/tryRoom', (req, res) => {
    const room = req.query.room;
    const guess = req.query.guess.toUpperCase();
    const filter = rooms.filter(r => r.room === room);

    if (!filter.length) return res.json({ error: 'Room not found' });

    const word = filter[0].word;
    if (normalizeString(guess) === normalizeString(word))
      return res.json({ correct: true, word });

    const present = compareWords(word, guess);

    res.json({ present });
  });

  app.get('/new', (req, res) => {
    secretWord = dict.random().toUpperCase();
    console.log('New word', secretWord);
    res.json({ success: true });
  });

  app.get('/try', (req, res) => {

    const guess = req.query.guess.toUpperCase();
    const index = dict.indexOf(guess);

    if (index === -1) return res.json({ invalid: true });

    if (normalizeString(guess) === normalizeString(secretWord))
      return res.json({ correct: true, word: secretWord });

    const present = compareWords(secretWord, guess);

    res.json({ present, word: dict.get(index).toUpperCase() });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
