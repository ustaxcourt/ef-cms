const axios = require('axios');

exports.PostAuthentication_Authentication = async function (event) {
  const result = await axios.post(
    'http://localhost:4000/cognito-triggers-local',
    event,
  );
  return {
    headers: result.headers,
    statusCode: result.statusCode,
  };
};

exports.PostConfirmation_ConfirmSignUp = async function (event) {
  const result = await axios.post(
    'http://localhost:4000/cognito-triggers-local',
    event,
  );

  return {
    headers: result.headers,
    statusCode: result.statusCode,
  };
};
