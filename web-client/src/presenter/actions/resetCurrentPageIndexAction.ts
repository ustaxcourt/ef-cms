import { state } from '@web-client/presenter/app.cerebral';

export const resetCurrentPageIndexAction = ({ store }: ActionProps) => {
  store.set(state.scanner.currentPageIndex, 0);
};
