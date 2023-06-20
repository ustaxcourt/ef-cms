import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';
export const loadingHelper = (get: Get) => {
  const currentPage = get(state.currentPage);
  const pageIsInterstitial = currentPage === 'Interstitial';

  return { pageIsInterstitial };
};
