import {
  getCognitoLoginUrl,
  getPublicSiteUrl,
} from '../../shared/src/sharedAppContext.js';

const applicationContextPublic = {
  getCognitoLoginUrl,
  getPublicSiteUrl,
  getUseCases: () => ({}),
};

module.exports = {
  applicationContextPublic,
};
