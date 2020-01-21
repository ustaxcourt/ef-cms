import { state } from 'cerebral';

/**
 * update props from modal state to pass to through sequence
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the utility method
 * @param {object} providers.get the cerebral get function
 * @returns {object} the new props
 */
export const primePropsFromEditDocketEntryMetaModalAction = ({
  applicationContext,
  get,
}) => {
  const docketRecordEntry = applicationContext
    .getUtilities()
    .filterEmptyStrings(get(state.modal.form));
  const caseId = get(state.modal.caseId);
  const docketRecordIndex = get(state.modal.docketRecordIndex) - 1;

  return { caseId, docketRecordEntry, docketRecordIndex, fromModal: true };
};
