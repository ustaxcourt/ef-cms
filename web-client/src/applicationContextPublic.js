import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';
import {
  getCognitoLoginUrl,
  getPublicSiteUrl,
} from '../../shared/src/sharedAppContext.js';
import { validateCaseAdvancedSearchInteractor } from '../../shared/src/business/useCases/validateCaseAdvancedSearchInteractor';
import axios from 'axios';
import deepFreeze from 'deep-freeze';

const applicationContextPublic = {
  getBaseUrl: () => {
    return process.env.API_URL || 'http://localhost:3000';
  },
  getCognitoLoginUrl,
  getConstants: () =>
    deepFreeze({
      COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
    }),
  getHttpClient: () => axios,
  getPublicSiteUrl,
  getUseCases: () => ({
    validateCaseAdvancedSearchInteractor,
  }),
};

module.exports = {
  applicationContextPublic,
};
