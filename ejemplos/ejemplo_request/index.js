'use strict';

const axios = require('axios');

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzdmZDkwNTAzNjg1MWUyYzQ2MGNiMDciLCJpYXQiOjE2Njk5Mjk2MDgsImV4cCI6MTY3MDEwMjQwOH0.3kJsnHPuJOQ-T_xKqgnnFDP5oVeTwiRdpjbh91o9SI8';

axios
  .get(`http://localhost:3000/api/agentes?token=${token}`)
  .then((response) => {
    console.log(response.data);
  })
  .catch((err) => {
    console.log(err.message, err.response.data);
  })
  .then(() => {
    return axios.get('https://swapi.dev/api/people/1');
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((err) => {
    console.log(err.message, err.response.data);
  });
