const axios = require('axios');

module.exports = axios.create({
  baseURL: process.env.API_URL,
  headers: { 'X-API-KEY': process.env.API_KEY },
});