const uuidv4 = require('uuid/v4');

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

const getPublicSiteUrl = () => {
  if (process.env.USTC_ENV === 'prod') {
    return 'https://https://ui-public-dev.ustc-case-mgmt.flexion.us/';
  } else {
    return process.env.PUBLIC_SITE_URL || 'http://localhost:5678/';
  }
};

const getUniqueId = () => {
  return uuidv4();
};

module.exports = {
  getCognitoLoginUrl,
  getPublicSiteUrl,
  getUniqueId,
};
