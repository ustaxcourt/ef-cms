import { state } from 'cerebral';

/**
 * Invokes delete path for stipulated decision draft documents. Otherwise, invokes archive path.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext contains the assignWorkItems method we will need from the getUseCases method
 * @param {object} providers.get the cerebral get helper function
 * @param {object} providers.path the next object in the path
 * @returns {object} the next path based on if document should be deleted or archived
 */
export const shouldDeleteOrArchiveDocumentAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const { STIPULATED_DECISION_EVENT_CODE } = applicationContext.getConstants();
  const documentId = get(state.archiveDraftDocument.documentId);
  const documentToRemove = get(state.caseDetail.documents).find(
    doc => doc.documentId === documentId,
  );

  if (documentToRemove.eventCode === STIPULATED_DECISION_EVENT_CODE) {
    return path.delete();
  } else {
    return path.archive();
  }
};
