import { menuHelper } from './computeds/menuHelper';

import { advancedSearchHelper } from './computeds/advancedSearchHelper';
import { loadingHelper } from './computeds/loadingHelper';
import { publicCaseDetailHeaderHelper } from './computeds/public/publicCaseDetailHeaderHelper';
import { publicCaseDetailHelper } from './computeds/public/publicCaseDetailHelper';

export const state = {
  advancedSearchForm: {
    countryType: 'domestic',
    currentPage: 1,
  },
  advancedSearchHelper,
  commonUI: {
    showBetaBar: true,
    showMobileMenu: false,
    showUsaBannerDetails: false,
  },
  currentPage: 'PublicSearch',
  docketNumberSearchForm: {},
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
