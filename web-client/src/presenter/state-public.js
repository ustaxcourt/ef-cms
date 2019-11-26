import { menuHelper } from './computeds/menuHelper';

import { advancedSearchHelper } from './computeds/advancedSearchHelper';

export const state = {
  advancedSearchForm: {},
  advancedSearchHelper,
  betaBar: {
    isVisible: true,
  },
  currentPage: 'PublicSearch',
  menuHelper,
  mobileMenu: {
    isVisible: false,
  },
  usaBanner: {
    showDetails: false,
  },
  user: {},
  validationErrors: {},
};
