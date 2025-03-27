import { state } from '@web-client/presenter/app.cerebral';

export const setTrialLocationPaginationAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.trialLocationPage[props.pageType], props.pageNumber || 0); // Always reset page number to 0
};
