import { state } from 'cerebral';

/**
 * sets state.trialSessionWorkCopy.filters based on the props.key
 * and props.value passed in
 *
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
}) => {
  const filters = get(state.trialSessionWorkingCopy.filters);

  if (props.key === 'filters.showAll' && props.value) {
    store.set(state.trialSessionWorkingCopy.filters, {
      aBasisReached: true,
      continued: true,
      dismissed: true,
      recall: true,
      rule122: true,
      setForTrial: true,
      settled: true,
      showAll: true,
      statusUnassigned: true,
      takenUnderAdvisement: true,
    });
  } else if (props.key === 'filters.showAll') {
    store.set(state.trialSessionWorkingCopy.filters, {
      aBasisReached: false,
      continued: false,
      dismissed: false,
      recall: false,
      rule122: false,
      setForTrial: false,
      settled: false,
      showAll: false,
      statusUnassigned: false,
      takenUnderAdvisement: false,
    });
  } else if (props.key.includes('filters') && props.value === false) {
    store.set(state.trialSessionWorkingCopy.filters.showAll, false);
  } else if (
    props.key.includes('filters') &&
    filters.aBasisReached === true &&
    filters.continued === true &&
    filters.dismissed === true &&
    filters.recall === true &&
    filters.rule122 === true &&
    filters.setForTrial === true &&
    filters.settled === true &&
    filters.statusUnassigned === true &&
    filters.takenUnderAdvisement === true
  ) {
    store.set(state.trialSessionWorkingCopy.filters.showAll, true);
  }
};
