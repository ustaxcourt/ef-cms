import { state } from '@web-client/presenter/app.cerebral';

export const setCurrentPaginationPageAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.currentPaginationPage, props.currentPaginationPage);
};
