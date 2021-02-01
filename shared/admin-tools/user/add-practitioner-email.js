const axios = require('axios');
const { activate, deactivate, getAuthToken } = require('./admin');

const { EFCMS_DOMAIN } = process.env;

const getPractitionerInfo = async ({ authToken, barNumber }) => {
  const user = {};

  const headers = {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-type': 'application/json',
    },
  };

  const url = `https://api.${EFCMS_DOMAIN}/practitioners/${barNumber}`;
  console.log(url);
  const info = await axios.get(url, user, headers);
  console.log(info);
};

const barNumber = process.argv[2];

(async () => {
  await activate();
  const authToken = await getAuthToken();
  await getPractitionerInfo({ authToken, barNumber });
  await deactivate();
})();
