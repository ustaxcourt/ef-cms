import { state } from 'cerebral';

/**
 * sets the current docket entry data for edit
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.set the cerebral set method
 * @param {object} providers.store the cerebral store
 * @returns {void} sets state for docket entry edit
 */
export const setDocketEntryFormForEditAction = ({ get, props, store }) => {
  const caseDetail = get(state.caseDetail);
  const { documentId } = props;

  const docketRecordEntry = caseDetail.docketRecord.find(
    entry => entry.documentId === documentId,
  );

  let docketEntryFormData = {};

  if (docketRecordEntry && docketRecordEntry.editState) {
    docketEntryFormData = JSON.parse(docketRecordEntry.editState);
  }

  store.set(state.form, docketEntryFormData);
};
