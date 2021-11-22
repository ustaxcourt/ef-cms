import { advancedDocumentSearchHelper } from './computeds/AdvancedSearch/advancedDocumentSearchHelper';
import { advancedSearchHelper } from './computeds/AdvancedSearch/advancedSearchHelper';
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
  todaysOpinions: [],
  todaysOrders: {
    results: [],
  },
  user: {},
  validationErrors: {},
};
