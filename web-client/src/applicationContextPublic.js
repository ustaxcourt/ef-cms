import {
  getCognitoLoginUrl,
  getPublicSiteUrl,
} from '../../shared/sharedAppContext.js';

const applicationContextPublic = {
  getCognitoLoginUrl,
  getPublicSiteUrl,
  getUseCases: () => ({}),
};

module.exports = {
  applicationContextPublic,
};
