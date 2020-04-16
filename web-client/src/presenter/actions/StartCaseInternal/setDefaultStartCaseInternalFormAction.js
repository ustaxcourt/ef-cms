import { state } from 'cerebral';

/**
 * sets state.form.procedureType to a default if it is not already set on the form
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const setDefaultStartCaseInternalFormAction = ({
  applicationContext,
  get,
  store,
}) => {
  const {
    orderForRequestedTrialLocation,
    preferredTrialCity,
    procedureType,
    requestForPlaceOfTrialFile,
  } = get(state.form);
  const { PROCEDURE_TYPES } = applicationContext.getConstants();

  if (!procedureType) {
    store.set(state.form.procedureType, PROCEDURE_TYPES[0]);
  }
  if (
    orderForRequestedTrialLocation === undefined &&
    !preferredTrialCity &&
    !requestForPlaceOfTrialFile
  ) {
    store.set(state.form.orderForRequestedTrialLocation, true);
  }
};
