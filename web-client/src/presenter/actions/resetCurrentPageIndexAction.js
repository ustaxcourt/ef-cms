import { state } from 'cerebral';

export const resetCurrentPageIndexAction = async ({ store }) => {
  store.set(state.scanner.currentPageIndex, 0);
};
