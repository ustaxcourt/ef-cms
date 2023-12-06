import { PUBLIC_DOCKET_RECORD_FILTER_OPTIONS } from '../../../shared/src/business/entities/EntityConstants';
import { advancedDocumentSearchHelper } from './computeds/AdvancedSearch/advancedDocumentSearchHelper';
import { advancedSearchHelper } from './computeds/AdvancedSearch/advancedSearchHelper';
import { caseSearchByNameHelper } from './computeds/AdvancedSearch/CaseSearchByNameHelper';
import { createAccountHelper } from './computeds/Public/createAccountHelper';
import { headerPublicHelper } from '@web-client/presenter/computeds/headerPublicHelper';
import { loadingHelper } from './computeds/loadingHelper';
import { menuHelper } from './computeds/menuHelper';
import { publicAlertHelper } from './computeds/Public/publicAlertHelper';
import { publicCaseDetailHeaderHelper } from './computeds/Public/publicCaseDetailHeaderHelper';
import { publicCaseDetailHelper } from './computeds/Public/publicCaseDetailHelper';
import { templateHelper } from './computeds/templateHelper';
import { todaysOpinionsHelper } from './computeds/Public/todaysOpinionsHelper';
import { todaysOrdersHelper } from './computeds/Public/todaysOrdersHelper';

const computeds = {
  advancedDocumentSearchHelper,
  advancedSearchHelper,
  alertHelper: publicAlertHelper,
  caseSearchByNameHelper,
  createAccountHelper,
  headerPublicHelper,
  loadingHelper,
  menuHelper,
  publicCaseDetailHeaderHelper,
  publicCaseDetailHelper,
  templateHelper,
  todaysOpinionsHelper,
  todaysOrdersHelper,
};

export const baseState = {
  advancedSearchForm: {},
  advancedSearchTab: 'case',
  alertError: null,
  alertSuccess: null,
  caseDetail: {} as RawPublicCase,
  cognito: { email: '' },
  cognitoLoginUrl: '',
  cognitoRequestPasswordResetUrl: '',
  cognitoResendVerificationLinkUrl: '',
  commonUI: {
    showBetaBar: true,
    showMobileMenu: false,
    showUsaBannerDetails: false,
  },
  currentPage: 'Interstitial',
  form: {} as Record<string, any>,
  header: {
    searchTerm: '',
    showBetaBar: true, // default state
    showMobileMenu: false,
    showUsaBannerDetails: false,
  },
  isPublic: true,
  isTerminalUser: false,
  progressIndicator: {
    // used for the spinner that shows when waiting for network responses
    waitingForResponse: false,
    waitingForResponseRequests: 0,
  },
  sessionMetadata: {
    docketRecordFilter: PUBLIC_DOCKET_RECORD_FILTER_OPTIONS.allDocuments,
    docketRecordSort: {},
  },
  showConfirmPassword: false,
  showPassword: false,
  todaysOpinions: [],
  todaysOrders: {
    results: [],
  },
  user: {},
  validationErrors: {},
};

export const initialPublicState = {
  ...baseState,
  ...computeds,
};

export type PublicClientState = typeof initialPublicState;
