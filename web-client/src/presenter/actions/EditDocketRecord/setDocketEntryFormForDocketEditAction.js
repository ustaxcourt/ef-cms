import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * sets the current docket entry data for edit
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 * @returns {void} sets state for docket entry edit
 */
export const setDocketEntryFormForDocketEditAction = ({
  get,
  props,
  store,
}) => {
  const caseDetail = get(state.caseDetail);
  const { documentId } = props;

  const docketRecordEntry = caseDetail.documents.find(
    entry => entry.documentId === documentId,
  );

  let docketEntryFormData = omit(docketRecordEntry, ['workItems']);
  docketEntryFormData.lodged = !!docketEntryFormData.lodged;

  store.set(state.form, docketEntryFormData);

  return { docketEntry: docketEntryFormData };
};
