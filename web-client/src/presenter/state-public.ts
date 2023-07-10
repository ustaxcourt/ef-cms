import { PUBLIC_DOCKET_RECORD_FILTER_OPTIONS } from '../../../shared/src/business/entities/EntityConstants';
import { advancedDocumentSearchHelper } from './computeds/AdvancedSearch/advancedDocumentSearchHelper';
import { advancedSearchHelper } from './computeds/AdvancedSearch/advancedSearchHelper';
import { caseSearchByNameHelper } from './computeds/AdvancedSearch/CaseSearchByNameHelper';
import { featureFlagHelper } from './computeds/FeatureFlags/featureFlagHelper';
import { loadingHelper } from './computeds/loadingHelper';
import { menuHelper } from './computeds/menuHelper';
import { publicAlertHelper } from './computeds/Public/publicAlertHelper';
import { publicCaseDetailHeaderHelper } from './computeds/Public/publicCaseDetailHeaderHelper';
import { publicCaseDetailHelper } from './computeds/Public/publicCaseDetailHelper';
import { templateHelper } from './computeds/templateHelper';
import { todaysOpinionsHelper } from './computeds/Public/todaysOpinionsHelper';
import { todaysOrdersHelper } from './computeds/Public/todaysOrdersHelper';

const helpers = {
  advancedDocumentSearchHelper,
  advancedSearchHelper,
  alertHelper: publicAlertHelper,
  caseSearchByNameHelper,
  featureFlagHelper,
  loadingHelper,
  menuHelper,
  publicCaseDetailHeaderHelper,
  publicCaseDetailHelper,
  templateHelper,
  todaysOpinionsHelper,
  todaysOrdersHelper,
};

export const state = {
  ...helpers,
  advancedSearchForm: {},
  advancedSearchTab: 'case',
  commonUI: {
    showBetaBar: true,
    showMobileMenu: false,
    showUsaBannerDetails: false,
  },
  currentPage: 'Interstitial',
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
  },
  todaysOpinions: [],
  todaysOrders: {
    results: [],
  },
  user: {},
  validationErrors: {},
};
