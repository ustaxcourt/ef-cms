const axios = require('axios');
const { checkEnvVar } = require('../util');

const { AUTH_TOKEN, EFCMS_DOMAIN } = process.env;

const getPractitionerInfo = async ({ barNumber }) => {
  const headers = {
    Authorization: `Bearer ${AUTH_TOKEN}`,
  };

  const url = `https://api.${EFCMS_DOMAIN}/practitioners/${barNumber}`;
  const info = await axios.get(url, { headers });
  return info.data;
};

const updatePractitionerInfo = async ({ barNumber, info }) => {
  const headers = {
    Authorization: `Bearer ${AUTH_TOKEN}`,
  };
  const url = `https://api.${EFCMS_DOMAIN}/async/practitioners/${barNumber}`;
  const result = await axios.put(url, { user: info }, { headers });
  console.log(result);
};

const processPracitioner = async ({ barNumber, email }) => {
  console.log(`Looking up ${barNumber}`);
  const info = await getPractitionerInfo({ barNumber });
  if (!info) {
    throw `Practitioner ${barNumber} not found!`;
  }
  if (info.email) {
    throw `Practitioner ${barNumber} already has an email: ${info.email}`;
  }
  info.email = email;
  console.log(`Updating ${barNumber} with Email: ${email}`);
  await updatePractitionerInfo({ barNumber, info });
};

(async () => {
  checkEnvVar(
    EFCMS_DOMAIN,
    'Please set EFCMS_DOMAIN in your local environment',
  );
  checkEnvVar(AUTH_TOKEN, 'Please set AUTH_TOKEN in your local environment');
  const practitioners = require('./practitioners.json');
  for (const [barNumber, email] of practitioners) {
    try {
      await processPracitioner({
        barNumber,
        email,
      });
    } catch (err) {
      console.log(`ERROR: ${barNumber} ${err}`);
    }
  }
})();
