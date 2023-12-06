import { state } from '@web-client/presenter/app.cerebral';

export const setCurrentPageIndexAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const totalPages = get(state.scanBatchPreviewerHelper.totalPages);
  const index = Math.min(Math.max(0, props.currentPageIndex), totalPages - 1);
  store.set(state.scanner.currentPageIndex, index);
};
