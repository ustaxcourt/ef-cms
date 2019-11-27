import { menuHelper } from './computeds/menuHelper';

import { advancedSearchHelper } from './computeds/advancedSearchHelper';

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
  menuHelper,
  mobileMenu: {
    isVisible: false,
  },
  searchMode: 'byName',
  usaBanner: {
    showDetails: false,
  },
  user: {},
  validationErrors: {},
};
