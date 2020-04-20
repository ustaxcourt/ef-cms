import { Case } from '../../shared/src/business/entities/cases/Case';
import { CaseSearch } from '../../shared/src/business/entities/cases/CaseSearch';
import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';
import { casePublicSearchInteractor } from '../../shared/src/proxies/casePublicSearchProxy';
import { compareCasesByDocketNumber } from '../../shared/src/business/utilities/getFormattedTrialSessionDetails';
import { formatDateString } from '../../shared/src/business/utilities/DateHandler';
import {
  formatDocketRecord,
  formatDocketRecordWithDocument,
  sortDocketRecords,
} from '../../shared/src/business/utilities/getFormattedCaseDetail';
import { generatePublicDocketRecordPdfInteractor } from '../../shared/src/proxies/public/generatePublicDocketRecordPdfProxy';
import {
  getCognitoLoginUrl,
  getPublicSiteUrl,
} from '../../shared/src/sharedAppContext.js';
import { getJudgeLastName } from '../../shared/src/business/utilities/getFormattedJudgeName';
import { getPublicCaseInteractor } from '../../shared/src/proxies/getPublicCaseProxy';
import { getPublicJudgesInteractor } from '../../shared/src/proxies/public/getPublicJudgesProxy';
import { orderPublicSearchInteractor } from '../../shared/src/proxies/orderPublicSearchProxy';
import { validateCaseAdvancedSearchInteractor } from '../../shared/src/business/useCases/validateCaseAdvancedSearchInteractor';
import { validateOrderAdvancedSearchInteractor } from '../../shared/src/business/useCases/validateOrderAdvancedSearchInteractor';
import axios from 'axios';
import deepFreeze from 'deep-freeze';

const applicationContextPublic = {
  getBaseUrl: () => {
    return process.env.API_URL || 'http://localhost:3000';
  },
  getCaseTitle: Case.getCaseTitle,
  getCognitoLoginUrl,
  getConstants: () =>
    deepFreeze({
      CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
      CASE_SEARCH_PAGE_SIZE: CaseSearch.CASE_SEARCH_PAGE_SIZE,
      COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
      US_STATES: ContactFactory.US_STATES,
    }),
  getCurrentUserToken: () => null,
  getHttpClient: () => axios,
  getPublicSiteUrl,
  getUseCases: () => ({
    casePublicSearchInteractor,
    generatePublicDocketRecordPdfInteractor,
    getCaseInteractor: getPublicCaseInteractor,
    getPublicJudgesInteractor,
    orderPublicSearchInteractor,
    validateCaseAdvancedSearchInteractor,
    validateOrderAdvancedSearchInteractor,
  }),
  getUtilities: () => {
    return {
      compareCasesByDocketNumber,
      formatDateString,
      formatDocketRecord,
      formatDocketRecordWithDocument,
      getJudgeLastName,
      sortDocketRecords,
    };
  },
};

export { applicationContextPublic };
