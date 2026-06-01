import {
  ADVANCED_SEARCH_OPINION_TYPES,
  ADVANCED_SEARCH_OPINION_TYPES_LIST,
  BENCH_OPINION_EVENT_CODE,
  BRIEF_EVENTCODES,
  CASE_CAPTION_POSTFIX,
  CASE_SEARCH_PAGE_SIZE,
  COUNTRY_TYPES,
  DATE_RANGE_SEARCH_OPTIONS,
  DOCKET_ENTRY_SEALED_TO_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  INITIAL_DOCUMENT_TYPES,
  MAX_ELASTICSEARCH_PAGINATION,
  MAX_DOCUMENT_SEARCH_RESULTS,
  MOTION_EVENT_CODES,
  OBJECTIONS_OPTIONS_MAP,
  OPINION_EVENT_CODES_WITHOUT_BENCH_OPINION,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ORDER_EVENT_CODES,
  POLICY_DATE_IMPACTED_EVENTCODES,
  PUBLIC_DOCKET_RECORD_FILTER_OPTIONS,
  ROLES,
  STANDING_PRETRIAL_EVENT_CODES,
  STIPULATED_DECISION_EVENT_CODE,
  TODAYS_ORDERS_SORTS,
  TODAYS_ORDERS_SORT_DEFAULT,
  TRANSCRIPT_EVENT_CODE,
  TRIAL_SESSION_SCOPE_TYPES,
  US_STATES,
  US_STATES_OTHER,
} from '../../shared/src/business/entities/EntityConstants';
import {
  Case,
  getContactPrimary,
  getContactSecondary,
} from '../../shared/src/business/entities/cases/Case';
import {
  ERROR_429,
  getEnvironment,
  getPublicSiteUrl,
} from '../../shared/src/sharedAppContext';
import { User } from '../../shared/src/business/entities/User';
import { casePublicSearchInteractor } from '@web-client/proxies/casePublicSearchProxy';
import { compareCasesByDocketNumber } from '../../shared/src/business/utilities/trialSession/getFormattedTrialSessionDetails';
import { confirmSignUpInteractor } from '@web-client/proxies/auth/confirmSignUpProxy';
import {
  createISODateString,
  formatDateString,
  formatNow,
  prepareDateFromString,
} from '../../shared/src/business/utilities/DateHandler';
import {
  formatDocketEntry,
  sortDocketEntries,
} from '../../shared/src/business/utilities/getFormattedCaseDetail';
import { generatePublicDocketRecordPdfInteractor } from '@web-client/proxies/public/generatePublicDocketRecordPdfProxy';
import { getAllFeatureFlagsInteractor } from '@web-client/proxies/featureFlag/getAllFeatureFlagsProxy';
import { getCurrentVersionInteractor } from '@web-client/proxies/getCurrentVersionProxy';
import { getDescriptionDisplay } from '../../shared/src/business/utilities/getDescriptionDisplay';
import { getDocumentDownloadUrlInteractor } from '@web-client/proxies/getDocumentDownloadUrlProxy';
import { getHealthCheckInteractor } from '@web-client/proxies/health/getHealthCheckProxy';
import { getHttpClient } from '@web-client/providers/httpClient';
import { getIsFeatureEnabled } from '../../shared/src/business/utilities/getIsFeatureEnabled';
import { getItem } from './persistence/localStorage/getItem';
import { getItemInteractor } from '../../shared/src/business/useCases/getItemInteractor';
import { getJudgeLastName } from '../../shared/src/business/utilities/getFormattedJudgeName';
import { getMaintenanceModePublicInteractor } from '@web-client/proxies/maintenance/getMaintenanceModePublicProxy';
import { getPublicCaseDocketEntriesInteractor } from '@web-client/proxies/getPublicCaseDocketEntriesProxy';
import { getPublicCaseExistsInteractor } from '@web-client/proxies/getPublicCaseExistsProxy';
import { getPublicCaseInteractor } from '@web-client/proxies/getPublicCaseProxy';
import { getPublicJudgesInteractor } from '@web-client/proxies/public/getPublicJudgesProxy';
import { getPublicPractitionerByBarNumberInteractor } from '@web-client/proxies/public/getPublicPractitionerByBarNumberProxy';
import { getPublicPractitionersByNameInteractor } from '@web-client/proxies/public/getPublicPractitionersByNameProxy';
import { getPublicTrialSessionDetailsInteractor } from '@web-client/proxies/trialSessions/getPublicTrialSessionDetailsProxy';
import { getPublicTrialSessionsInteractor } from '@web-client/proxies/trialSessions/getPublicTrialSessionsProxy';
import { getPublicUsersInSectionInteractor } from '@web-client/proxies/users/getPublicUsersInSectionProxy';
import { getSealedDocketEntryTooltip } from '../../shared/src/business/utilities/getSealedDocketEntryTooltip';
import { getTodaysOpinionsInteractor } from '@web-client/proxies/public/getTodaysOpinionsProxy';
import { getTodaysOrdersInteractor } from '@web-client/proxies/public/getTodaysOrdersProxy';
import { openUrlInNewTab } from './presenter/utilities/openUrlInNewTab';
import { opinionPublicSearchInteractor } from '@web-client/proxies/opinionPublicSearchProxy';
import { orderPublicSearchInteractor } from '@web-client/proxies/orderPublicSearchProxy';
import { removeItem } from './persistence/localStorage/removeItem';
import { removeItemInteractor } from '../../shared/src/business/useCases/removeItemInteractor';
import { setItem } from './persistence/localStorage/setItem';
import { setItemInteractor } from '../../shared/src/business/useCases/setItemInteractor';
import { signUpUserInteractor } from '@web-client/proxies/signUpUserProxy';
import { tryCatchDecorator } from './tryCatchDecorator';
import { validateCaseAdvancedSearchInteractor } from '../../shared/src/business/useCases/validateCaseAdvancedSearchInteractor';
import { validateOpinionAdvancedSearchInteractor } from '../../shared/src/business/useCases/validateOpinionAdvancedSearchInteractor';
import { validateOrderAdvancedSearchInteractor } from '../../shared/src/business/useCases/validateOrderAdvancedSearchInteractor';
import { verifyUserPendingEmailInteractor } from '@web-client/proxies/public/verifyUserPendingEmailProxy';
import deepFreeze from 'deep-freeze';

const ADVANCED_SEARCH_TABS = {
  CASE: 'case',
  OPINION: 'opinion',
  ORDER: 'order',
  PRACTITIONER: 'practitioner',
};

const allUseCases = {
  casePublicSearchInteractor,
  confirmSignUpInteractor,
  generatePublicDocketRecordPdfInteractor,
  getAllFeatureFlagsInteractor,
  getCaseExistsInteractor: getPublicCaseExistsInteractor,
  getCaseDocketEntriesInteractor: getPublicCaseDocketEntriesInteractor,
  getCaseInteractor: getPublicCaseInteractor,
  getCurrentVersionInteractor,
  getDocumentDownloadUrlInteractor,
  getHealthCheckInteractor,
  getItemInteractor,
  getMaintenanceModePublicInteractor,
  getPractitionerByBarNumberInteractor:
    getPublicPractitionerByBarNumberInteractor,
  getPractitionersByNameInteractor: getPublicPractitionersByNameInteractor,
  getPublicJudgesInteractor,
  getPublicTrialSessionDetailsInteractor,
  getTodaysOpinionsInteractor,
  getTodaysOrdersInteractor,
  getTrialSessionsInteractor: getPublicTrialSessionsInteractor,
  getUsersInSectionInteractor: getPublicUsersInSectionInteractor,
  opinionPublicSearchInteractor,
  orderPublicSearchInteractor,
  removeItemInteractor,
  setItemInteractor,
  signUpUserInteractor,
  validateCaseAdvancedSearchInteractor,
  validateOpinionAdvancedSearchInteractor,
  validateOrderAdvancedSearchInteractor,
  verifyUserPendingEmailInteractor,
};
tryCatchDecorator(allUseCases);

const frozenConstants = deepFreeze({
  ADVANCED_SEARCH_OPINION_TYPES,
  ADVANCED_SEARCH_OPINION_TYPES_LIST,
  ADVANCED_SEARCH_TABS,
  BENCH_OPINION_EVENT_CODE,
  BRIEF_EVENTCODES,
  CASE_CAPTION_POSTFIX,
  CASE_SEARCH_PAGE_SIZE,
  COUNTRY_TYPES,
  DATE_RANGE_SEARCH_OPTIONS,
  DOCKET_ENTRY_SEALED_TO_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  ERROR_429,
  INITIAL_DOCUMENT_TYPES,
  MAX_DOCUMENT_SEARCH_RESULTS,
  MOTION_EVENT_CODES,
  OBJECTIONS_OPTIONS_MAP,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  OPINION_EVENT_CODES_WITHOUT_BENCH_OPINION,
  ORDER_EVENT_CODES,
  POLICY_DATE_IMPACTED_EVENTCODES,
  PUBLIC_DOCKET_RECORD_FILTER_OPTIONS,
  STANDING_PRETRIAL_EVENT_CODES,
  STIPULATED_DECISION_EVENT_CODE,
  TODAYS_ORDERS_SORT_DEFAULT,
  TODAYS_ORDERS_SORTS,
  TRANSCRIPT_EVENT_CODE,
  TRIAL_SESSION_SCOPE_TYPES,
  US_STATES,
  US_STATES_OTHER,
  USER_ROLES: ROLES,
  MAX_ELASTICSEARCH_PAGINATION,
});

let forceRefreshCallback: () => {};

const applicationContextPublic = {
  getBaseUrl: () => {
    return process.env.API_URL || 'http://localhost:4001';
  },
  getCaseTitle: Case.getCaseTitle,
  getConstants: () => frozenConstants,
  getEnvironment,
  getForceRefreshCallback() {
    return forceRefreshCallback;
  },
  getHttpClient: () => {
    const apiUrl = process.env.API_URL || 'http://localhost:4000';
    return getHttpClient(forceRefreshCallback, apiUrl);
  },
  getLogger: () => ({
    error: () => {
      // console.error(value);
    },
    info: (key, value) => {
      console.info(key, JSON.stringify(value));
    },
    time: key => {
      console.time(key);
    },
    timeEnd: key => {
      console.timeEnd(key);
    },
  }),
  getPersistenceGateway: () => {
    return {
      getItem,
      removeItem,
      setItem,
    };
  },
  getPrivateUrl: () => {
    return process.env.ENV === 'local'
      ? 'http://localhost:1234'
      : `https://app.${process.env.EFCMS_DOMAIN}`;
  },
  getPublicSiteUrl,
  getUseCases: () => allUseCases,
  getUtilities: () => {
    return {
      compareCasesByDocketNumber,
      createISODateString,
      formatDateString,
      formatDocketEntry,
      formatNow,
      getContactPrimary,
      getContactSecondary,
      getDescriptionDisplay,
      getJudgeLastName,
      getSealedDocketEntryTooltip,
      isExternalUser: User.isExternalUser,
      isInternalUser: User.isInternalUser,
      openUrlInNewTab,
      prepareDateFromString,
      sortDocketEntries,
    };
  },
  isFeatureEnabled: featureName => {
    return getIsFeatureEnabled(featureName, {}, getEnvironment().stage);
  },
  isPublicUser: () => true,
  setForceRefreshCallback(callback) {
    forceRefreshCallback = callback;
  },
};

export { applicationContextPublic };

export type ClientPublicApplicationContext = typeof applicationContextPublic;
