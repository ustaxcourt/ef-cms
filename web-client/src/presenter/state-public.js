import { menuHelper } from './computeds/menuHelper';

import { advancedSearchHelper } from './computeds/advancedSearchHelper';
import { loadingHelper } from './computeds/loadingHelper';
import { publicAlertHelper } from './computeds/public/publicAlertHelper';
import { publicCaseDetailHeaderHelper } from './computeds/public/publicCaseDetailHeaderHelper';
import { publicCaseDetailHelper } from './computeds/public/publicCaseDetailHelper';

export const state = {
  advancedSearchForm: {},
  advancedSearchHelper,
  alertHelper: publicAlertHelper,
  commonUI: {
    showBetaBar: true,
    showMobileMenu: false,
    showUsaBannerDetails: false,
  },
  currentPage: 'Interstitial',
  loadingHelper,
  menuHelper,
  publicCaseDetailHeaderHelper,
  publicCaseDetailHelper,
  searchMode: 'byName',
  user: {},
  validationErrors: {},
  waitingForResponse: false,
  waitingForResponseRequests: 0,
};
