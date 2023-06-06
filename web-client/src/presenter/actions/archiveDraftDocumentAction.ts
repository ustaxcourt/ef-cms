import { state } from 'cerebral';

/**
 * calls the proxy/interactor to archive a document on the backend
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext contains the assignWorkItems method we will need from the getUseCases method
 * @param {object} providers.props props passed through via cerebral
 * @param {object} providers.store the cerebral store object
 * @returns {Promise} async action
 */
export const archiveDraftDocumentAction = async ({
  applicationContext,
  get,
  path,
  store,
}: ActionProps) => {
  const { docketEntryId, redirectToCaseDetail } = get(
    state.archiveDraftDocument,
  );
  const docketNumber = get(state.caseDetail.docketNumber);

  let updatedCase;
  try {
    updatedCase = await applicationContext
      .getUseCases()
      .archiveDraftDocumentInteractor(applicationContext, {
        docketEntryId,
        docketNumber,
      });
  } catch (error: any) {
    const isArchivingServedEntry =
      error?.originalError?.response?.data?.includes(
        'Cannot archive docket entry that has already been served.',
      );
    if (isArchivingServedEntry) {
      return path.error({ showModal: 'DocketEntryHasAlreadyBeenServedModal' });
    }
    throw error;
  }

  if (redirectToCaseDetail) {
    store.set(state.saveAlertsForNavigation, true);

    return path.success({
      alertSuccess: {
        message: 'Document deleted.',
      },
      caseDetail: updatedCase,
      docketNumber,
    });
  }

  return path.success({
    alertSuccess: {
      message: 'Document deleted.',
    },
    caseDetail: updatedCase,
  });
};
