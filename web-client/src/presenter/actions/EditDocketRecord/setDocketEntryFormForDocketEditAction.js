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
  applicationContext,
  get,
  props,
  store,
}) => {
  const caseDetail = get(state.caseDetail);
  const { documentId } = props;

  const initialDocument = caseDetail.documents.find(
    entry => entry.documentId === documentId,
  );

  let docketEntryFormData = omit(initialDocument, ['workItems']);

  const docketRecordEntry = caseDetail.docketRecord.find(
    entry => entry.documentId === documentId,
  );

  if (docketRecordEntry && docketRecordEntry.editState) {
    const parsedJson = JSON.parse(docketRecordEntry.editState);
    if (parsedJson.caseId) {
      docketEntryFormData = JSON.parse(docketRecordEntry.editState);
    }
  }

  if (docketEntryFormData.date) {
    const deconstructedDate = applicationContext
      .getUtilities()
      .deconstructDate(docketEntryFormData.date);
    docketEntryFormData = {
      ...docketEntryFormData,
      ...deconstructedDate,
    };
  }

  docketEntryFormData.lodged = !!docketEntryFormData.lodged;

  store.set(state.form, docketEntryFormData);

  return {
    docketEntry: docketEntryFormData,
    key: 'initEventCode',
    value: docketEntryFormData.eventCode,
  };
};
