import { state } from '@web-client/presenter/app.cerebral';

/**
 * assigns the current case details qc workitem to the current user
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @returns {Promise} async action
 */
export const assignPetitionToAuthenticatedUserAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();
  const { docketEntries } = get(state.caseDetail);
  const user = applicationContext.getCurrentUser();

  const petitionDocument = docketEntries.find(
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
