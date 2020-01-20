import { state } from 'cerebral';

/**
 * update props from modal state to pass to through sequence
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the new props
 */
export const primePropsFromEditDocketRecordEntryModalAction = ({ get }) => {
  const docketRecordEntry = get(state.modal.form);
  const caseId = get(state.modal.caseId);
  const docketRecordIndex = get(state.modal.docketRecordIndex);

  return { caseId, docketRecordEntry, docketRecordIndex, fromModal: true };
};
