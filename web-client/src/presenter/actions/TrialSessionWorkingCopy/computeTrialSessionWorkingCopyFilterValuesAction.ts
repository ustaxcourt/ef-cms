/* eslint-disable complexity */

import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets state.trialSessionWorkCopy.filters based on the props.key
 * and props.value passed in
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.props the cerebral props object
 * @returns {void}
 */
export const computeTrialSessionWorkingCopyFilterValuesAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const filters = get(state.trialSessionWorkingCopy.filters);

  if (props.key) {
    if (props.key === 'filters.showAll' && props.value) {
      store.set(state.trialSessionWorkingCopy.filters, {
        basisReached: true,
        continued: true,
        definiteTrial: true,
        dismissed: true,
        motionToDismiss: true,
        probableSettlement: true,
        probableTrial: true,
        recall: true,
        rule122: true,
        setForTrial: true,
        settled: true,
        showAll: true,
        statusUnassigned: true,
        submittedCAV: true,
      });
    } else if (props.key === 'filters.showAll') {
      store.set(state.trialSessionWorkingCopy.filters, {
        basisReached: false,
        continued: false,
        definiteTrial: false,
        dismissed: false,
        motionToDismiss: false,
        probableSettlement: false,
        probableTrial: false,
        recall: false,
        rule122: false,
        setForTrial: false,
        settled: false,
        showAll: false,
        statusUnassigned: false,
        submittedCAV: false,
      });
    } else if (props.key.includes('filters') && props.value === false) {
      store.set(state.trialSessionWorkingCopy.filters.showAll, false);
    } else if (
      props.key.includes('filters') &&
      filters.basisReached &&
      filters.continued &&
      filters.definiteTrial &&
      filters.dismissed &&
      filters.motionToDismiss &&
      filters.probableSettlement &&
      filters.probableTrial &&
      filters.recall &&
      filters.rule122 &&
      filters.setForTrial &&
      filters.settled &&
      filters.statusUnassigned &&
      filters.submittedCAV
    ) {
      store.set(state.trialSessionWorkingCopy.filters.showAll, true);
    }
  }
};
