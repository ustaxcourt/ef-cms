import { state } from 'cerebral';

/**
 * set the default sort for the working copy table
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.get the cerebral get function
 */
export const setDefaultWorkingCopyValuesAction = ({
  applicationContext,
  get,
  store,
}) => {
  const { ALLOWLIST_FEATURE_FLAGS } = applicationContext.getConstants();
  const sort = get(state.trialSessionWorkingCopy.sort);
  const sortOrder = get(state.trialSessionWorkingCopy.sortOrder);
  const filters = get(state.trialSessionWorkingCopy.filters);
  let trialSessionWorkingCopy = get(state.trialSessionWorkingCopy);

  const updatedTrialSessionTypesEnabled = get(
    state.featureFlags[ALLOWLIST_FEATURE_FLAGS.UPDATED_TRIAL_STATUS_TYPES.key],
  );

  if (updatedTrialSessionTypesEnabled) {
    Object.values(trialSessionWorkingCopy.caseMetadata).forEach(aCase => {
      if (aCase.trialStatus === 'settled') {
        aCase.trialStatus = 'basisReached';
      }
    });
  }

  if (!sort) {
    store.set(state.trialSessionWorkingCopy.sort, 'docket');
  }

  if (!sortOrder) {
    store.set(state.trialSessionWorkingCopy.sortOrder, 'asc');
  }

  if (!filters) {
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
  }
};
