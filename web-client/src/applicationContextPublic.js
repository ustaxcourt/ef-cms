import {
  CASE_CAPTION_POSTFIX,
  CASE_SEARCH_PAGE_SIZE,
  COUNTRY_TYPES,
  US_STATES,
  US_STATES_OTHER,
} from '../../shared/src/business/entities/EntityConstants';
import { Case } from '../../shared/src/business/entities/cases/Case';
import { casePublicSearchInteractor } from '../../shared/src/proxies/casePublicSearchProxy';
import { compareCasesByDocketNumber } from '../../shared/src/business/utilities/getFormattedTrialSessionDetails';
import {
  createISODateString,
  formatDateString,
} from '../../shared/src/business/utilities/DateHandler';
import {
  formatDocketRecord,
  formatDocketRecordWithDocument,
  sortDocketRecords,
} from '../../shared/src/business/utilities/getFormattedCaseDetail';
import { generatePublicDocketRecordPdfInteractor } from '../../shared/src/proxies/public/generatePublicDocketRecordPdfProxy';
import { getCaseForPublicDocketSearchInteractor } from '../../shared/src/proxies/public/getCaseForPublicDocketNumberSearchProxy';
import {
  getCognitoLoginUrl,
  getPublicSiteUrl,
} from '../../shared/src/sharedAppContext.js';
import { getDocumentDownloadUrlInteractor } from '../../shared/src/proxies/getDocumentDownloadUrlProxy';
import { getJudgeLastName } from '../../shared/src/business/utilities/getFormattedJudgeName';
import { getPublicCaseInteractor } from '../../shared/src/proxies/getPublicCaseProxy';
import { getPublicJudgesInteractor } from '../../shared/src/proxies/public/getPublicJudgesProxy';
import { getTodaysOpinionsInteractor } from '../../shared/src/proxies/public/getTodaysOpinionsProxy';
import { opinionPublicSearchInteractor } from '../../shared/src/proxies/opinionPublicSearchProxy';
import { orderPublicSearchInteractor } from '../../shared/src/proxies/orderPublicSearchProxy';
import { validateCaseAdvancedSearchInteractor } from '../../shared/src/business/useCases/validateCaseAdvancedSearchInteractor';
import { validateOpinionAdvancedSearchInteractor } from '../../shared/src/business/useCases/validateOpinionAdvancedSearchInteractor';
import { validateOrderAdvancedSearchInteractor } from '../../shared/src/business/useCases/validateOrderAdvancedSearchInteractor';
import axios from 'axios';
import deepFreeze from 'deep-freeze';

const ADVANCED_SEARCH_TABS = {
  CASE: 'case',
  OPINION: 'opinion',
  ORDER: 'order',
};

const applicationContextPublic = {
  getBaseUrl: () => {
    return process.env.API_URL || 'http://localhost:5000';
  },
  getCaseTitle: Case.getCaseTitle,
  getCognitoLoginUrl,
  getConstants: () =>
    deepFreeze({
      ADVANCED_SEARCH_TABS,
      CASE_CAPTION_POSTFIX: CASE_CAPTION_POSTFIX,
      CASE_SEARCH_PAGE_SIZE: CASE_SEARCH_PAGE_SIZE,
      COUNTRY_TYPES: COUNTRY_TYPES,
      US_STATES,
      US_STATES_OTHER,
    }),
  getCurrentUserToken: () => null,
  getHttpClient: () => axios,
  getPublicSiteUrl,
  getUseCases: () => ({
    casePublicSearchInteractor,
    generatePublicDocketRecordPdfInteractor,
    getCaseForPublicDocketSearchInteractor,
    getCaseInteractor: getPublicCaseInteractor,
    getDocumentDownloadUrlInteractor,
    getPublicJudgesInteractor,
    getTodaysOpinionsInteractor,
    opinionPublicSearchInteractor,
    orderPublicSearchInteractor,
    validateCaseAdvancedSearchInteractor,
    validateOpinionAdvancedSearchInteractor,
    validateOrderAdvancedSearchInteractor,
  }),
  getUtilities: () => {
    return {
      compareCasesByDocketNumber,
      createISODateString,
      formatDateString,
      formatDocketRecord,
      formatDocketRecordWithDocument,
      getJudgeLastName,
      sortDocketRecords,
    };
  },
};

export { applicationContextPublic };
