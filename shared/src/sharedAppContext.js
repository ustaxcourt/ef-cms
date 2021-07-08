const { v4: uuidv4 } = require('uuid');

const getCognitoLoginUrl = () => {
  if (process.env.COGNITO) {
    return 'https://auth-dev-flexion-efcms.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=6tu6j1stv5ugcut7dqsqdurn8q&redirect_uri=http%3A//localhost:1234/log-in';
  } else {
    return (
      process.env.COGNITO_LOGIN_URL ||
      'http://localhost:1234/mock-login?redirect_uri=http%3A//localhost%3A1234/log-in'
    );
  }
};

const getEnvironment = () => ({
  stage: process.env.STAGE || 'local',
});

const getPublicSiteUrl = () => {
  return process.env.PUBLIC_SITE_URL || 'http://localhost:5678';
};

const getUniqueId = () => {
  return uuidv4();
};

const chiefJudgeNameForSigning = 'Maurice B. Foley';
const clerkOfCourtNameForSigning = 'Stephanie A. Servoss';

module.exports = {
  chiefJudgeNameForSigning,
  clerkOfCourtNameForSigning,
  getCognitoLoginUrl,
  getEnvironment,
  getPublicSiteUrl,
  getUniqueId,
};
