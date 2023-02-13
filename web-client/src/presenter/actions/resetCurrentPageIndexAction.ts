import { state } from 'cerebral';

export const resetCurrentPageIndexAction = ({ store }) => {
  store.set(state.scanner.currentPageIndex, 0);
};
