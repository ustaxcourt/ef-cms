import { state } from 'cerebral';

export const loadingHelper = get => {
  const currentPage = get(state.currentPage);
  const pageIsInterstitial = currentPage === 'Interstitial';

  return { pageIsInterstitial };
};
