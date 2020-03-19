import { state } from 'cerebral';

export const setCurrentPageIndexAction = ({ get, props, store }) => {
  const totalPages = get(state.scanBatchPreviewerHelper.totalPages);
  const index = Math.min(Math.max(0, props.currentPageIndex), totalPages - 1);
  store.set(state.scanner.currentPageIndex, index);
};
