import { DEFAULT_FILTERED_BLOCKED_CASE_STATUSES } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const setPropsForTrialLocationAction = ({
  props,
  store,
}: ActionProps) => {
  const { trialLocation } = props;
  const blockedCaseFilter = DEFAULT_FILTERED_BLOCKED_CASE_STATUSES;

  store.set(state.trialLocationPage.location, trialLocation);
  return { blockedCaseFilter };
};
