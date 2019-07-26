import { state } from 'cerebral';

export const resetCurrentPageIndexAction = async ({ store }) => {
  store.set(state.currentPageIndex, 0);
};
