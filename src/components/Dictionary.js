const axios = require('axios');

const WORDS_URL = 'https://gist.githubusercontent.com/queijoz/cf74ed2df3264a3f4b4d896a16dff455/raw/681325314d5d1e436d57e1c4db8f2413ff4aab9f/gistfile1.txt';
const NO_ACCENT_URL = 'https://gist.githubusercontent.com/queijoz/61d2c0fc9e6c18064575eabe70fb98a3/raw/432e154dd6001ced67ed26492cb82137021c9d55/gistfile1.txt';

let words = [];
let noAccent = [];

function get (index)
{
    return words[index];
}

function random ()
{
    return words[Math.floor(Math.random() * words.length)];
}

function includes (word)
{
    return noAccent.includes(word.toLowerCase());
}

function indexOf (word)
{
    return noAccent.indexOf(word.toLowerCase());
}

async function Dictionary ()
{
    await Promise.all([axios.get(WORDS_URL), axios.get(NO_ACCENT_URL)])
        .then(responses => [words, noAccent] = responses.map(res => res.data.split('\n')));

    return {
        get,
        random,
        includes,
        indexOf
    }
}

module.exports = Dictionary();