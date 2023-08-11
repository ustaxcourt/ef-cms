import { state } from '@web-client/presenter/app.cerebral';

export const archiveDraftDocumentAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { docketEntryId, docketNumber } = get(state.archiveDraftDocument);

  let updatedCase: RawCase;
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

  return path.success({
    alertSuccess: {
      message: 'Document deleted.',
    },
    caseDetail: updatedCase,
  });
};
