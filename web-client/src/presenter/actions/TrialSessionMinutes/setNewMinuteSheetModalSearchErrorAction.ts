import { state } from '@web-client/presenter/app.cerebral';

export const setNewMinuteSheetModalSearchErrorAction = ({
  props,
  store,
}: ActionProps) => {
  const { errorType } = props;

  store.set(state.modal.hasSearched, true);

  if (errorType === 'caseAlreadyOnTrialSession') {
    store.set(state.modal.isCaseAlreadyOnTrialSession, true);
    store.set(state.modal.noResultsFound, false);
  } else {
    store.set(state.modal.noResultsFound, true);
    store.set(state.modal.isCaseAlreadyOnTrialSession, false);
  }
};
