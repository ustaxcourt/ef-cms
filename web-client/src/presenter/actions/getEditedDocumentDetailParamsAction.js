import { state } from 'cerebral';

/**
 * Gets the docketNumber and docketEntryId from current state
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {object} contains the docketNumber and docketEntryId
 */
export const getEditedDocumentDetailParamsAction = ({ get, props }) => {
  const caseDetail = get(state.caseDetail);
  const documentToEdit = get(state.documentToEdit);
  const docketEntryId = documentToEdit
    ? documentToEdit.docketEntryId
    : get(props.primaryDocumentFileId);

  return {
    docketEntryId,
    docketNumber: caseDetail.docketNumber,
  };
};
