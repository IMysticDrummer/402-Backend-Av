'use strict';

const axios = require('axios');

const token =
  's%3AFIE8F5eVF7r3QYVxlq8S-xsQ1yWw-Av4.Rddw788lXU0lwMpmss%2B93S%2FdHSpjwIdDKFDlqH3sNps';

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
