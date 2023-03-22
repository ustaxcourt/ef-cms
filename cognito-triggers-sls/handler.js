const axios = require('axios');

exports.PostAuthentication_Authentication = async function (event) {
  axios.post('http://localhost:4000/cognito-triggers-local', event);
};
