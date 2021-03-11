import { state } from 'cerebral';

/**
 * assigns the current case details qc workitem to the current user
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @returns {Promise} async action
 */
export const assignPetitionToAuthenticatedUserAction = async ({
  applicationContext,
  get,
}) => {
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();

  const petitionDocument = (get(state.caseDetail.docketEntries) || []).find(
    document =>
      document.documentType === INITIAL_DOCUMENT_TYPES.petition.documentType,
  );

  const petitionDocumentQCWorkItem =
    petitionDocument && petitionDocument.workItem;

  if (petitionDocumentQCWorkItem) {
    await applicationContext
      .getUseCases()
      .assignWorkItemsInteractor(applicationContext, {
        assigneeId: user.userId,
        assigneeName: user.name,
        workItemId: petitionDocumentQCWorkItem.workItemId,
      });
  }
};
