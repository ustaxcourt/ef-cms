import { menuHelper } from './computeds/menuHelper';

import { advancedSearchHelper } from './computeds/advancedSearchHelper';
import { loadingHelper } from './computeds/loadingHelper';
import { publicCaseDetailHeaderHelper } from './computeds/publicCaseDetailHeaderHelper';

export const state = {
  advancedSearchForm: {
    countryType: 'domestic',
    currentPage: 1,
  },
  advancedSearchHelper,
  betaBar: {
    isVisible: true,
  },
  currentPage: 'PublicSearch',
  docketNumberSearchForm: {},
  loadingHelper,
  menuHelper,
  mobileMenu: {
    isVisible: false,
  },
  publicCaseDetailHeaderHelper,
  searchMode: 'byName',
  usaBanner: {
    showDetails: false,
  },
  user: {},
  validationErrors: {},
  waitingForResponse: false,
};
