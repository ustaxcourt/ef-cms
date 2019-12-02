import { Case } from '../../shared/src/business/entities/cases/Case';
import { CaseSearch } from '../../shared/src/business/entities/cases/CaseSearch';
import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';
import { casePublicSearchInteractor } from '../../shared/src/proxies/casePublicSearchProxy';
import {
  getCognitoLoginUrl,
  getPublicSiteUrl,
} from '../../shared/src/sharedAppContext.js';
import { getPublicCaseInteractor } from '../../shared/src/proxies/getPublicCaseProxy';
import { validateCaseAdvancedSearchInteractor } from '../../shared/src/business/useCases/validateCaseAdvancedSearchInteractor';
import axios from 'axios';
import deepFreeze from 'deep-freeze';

import { compareCasesByDocketNumber } from '../../shared/src/business/utilities/getFormattedTrialSessionDetails';

import { formatDateString } from '../../shared/src/business/utilities/DateHandler';

const applicationContextPublic = {
  getBaseUrl: () => {
    return process.env.API_URL || 'http://localhost:3000';
  },
  getCaseCaptionNames: Case.getCaseCaptionNames,
  getCognitoLoginUrl,
  getConstants: () =>
    deepFreeze({
      CASE_SEARCH_PAGE_SIZE: CaseSearch.CASE_SEARCH_PAGE_SIZE,
      COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
      US_STATES: ContactFactory.US_STATES,
    }),

  getCurrentUserToken: () => null,
  getHttpClient: () => axios,
  getPublicSiteUrl,
  getUseCases: () => ({
    casePublicSearchInteractor,
    getCaseInteractor: getPublicCaseInteractor,
    validateCaseAdvancedSearchInteractor,
  }),
  getUtilities: () => {
    return {
      compareCasesByDocketNumber,
      formatDateString,
    };
  },
};

module.exports = {
  applicationContextPublic,
};
