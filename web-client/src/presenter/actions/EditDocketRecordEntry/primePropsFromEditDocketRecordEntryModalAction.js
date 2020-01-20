import { state } from 'cerebral';

const filterEmptyStrings = params => {
  const removeEmpty = obj => {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object') {
        removeEmpty(obj[key]);
      } else if (obj[key] === '') {
        delete obj[key];
      }
    });
  };

  if (params) {
    removeEmpty(params);
  }
  return params;
};

/**
 * update props from modal state to pass to through sequence
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the new props
 */
export const primePropsFromEditDocketRecordEntryModalAction = ({ get }) => {
  const docketRecordEntry = filterEmptyStrings(get(state.modal.form));
  const caseId = get(state.modal.caseId);
  const docketRecordIndex = get(state.modal.docketRecordIndex);

  return { caseId, docketRecordEntry, docketRecordIndex, fromModal: true };
};
