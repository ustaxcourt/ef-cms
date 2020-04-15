import { menuHelper } from './computeds/menuHelper';

import {
  advancedOrderSearchHelper,
  advancedSearchHelper,
} from './computeds/advancedSearchHelper';
import { loadingHelper } from './computeds/loadingHelper';
import { publicAlertHelper } from './computeds/public/publicAlertHelper';
import { publicCaseDetailHeaderHelper } from './computeds/public/publicCaseDetailHeaderHelper';
import { publicCaseDetailHelper } from './computeds/public/publicCaseDetailHelper';

const helpers = {
  advancedOrderSearchHelper,
  advancedSearchHelper,
  alertHelper: publicAlertHelper,
  loadingHelper,
  menuHelper,
  publicCaseDetailHeaderHelper,
  publicCaseDetailHelper,
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
  progressIndicator: {
    // used for the spinner that shows when waiting for network responses
    waitingForResponse: false,
    waitingForResponseRequests: 0,
  },
  user: {},
  validationErrors: {},
};
