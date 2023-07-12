import { state } from 'cerebral';

export const resetCurrentPageIndexAction = ({ store }: ActionProps) => {
  store.set(state.scanner.currentPageIndex, 0);
};
