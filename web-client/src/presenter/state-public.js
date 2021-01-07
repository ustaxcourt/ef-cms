import { advancedDocumentSearchHelper } from './computeds/AdvancedSearch/advancedDocumentSearchHelper';
import { advancedSearchHelper } from './computeds/AdvancedSearch/advancedSearchHelper';
import { loadingHelper } from './computeds/loadingHelper';
import { menuHelper } from './computeds/menuHelper';
import { publicAlertHelper } from './computeds/public/publicAlertHelper';
import { publicCaseDetailHeaderHelper } from './computeds/public/publicCaseDetailHeaderHelper';
import { publicCaseDetailHelper } from './computeds/public/publicCaseDetailHelper';
import { templateHelper } from './computeds/templateHelper';
import { todaysOpinionsHelper } from './computeds/public/todaysOpinionsHelper';
import { todaysOrdersHelper } from './computeds/public/todaysOrdersHelper';

const helpers = {
  advancedDocumentSearchHelper,
  advancedSearchHelper,
  alertHelper: publicAlertHelper,
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
