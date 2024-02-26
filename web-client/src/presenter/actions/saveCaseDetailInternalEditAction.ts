import { FileUploadProgressMapType } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const saveCaseDetailInternalEditAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps<{
  fileUploadProgressMap: FileUploadProgressMapType;
}>) => {
  const {
    INITIAL_DOCUMENT_TYPES,
    INITIAL_DOCUMENT_TYPES_FILE_MAP,
    STATUS_TYPES,
  } = applicationContext.getConstants();
  const originalCase = get(state.caseDetail);
  const { fileUploadProgressMap } = props;
  const caseToUpdate = get(state.form);

  const keys = Object.keys(INITIAL_DOCUMENT_TYPES);

  for (const key of keys) {
    const fileKey = INITIAL_DOCUMENT_TYPES_FILE_MAP[key];

    if (fileUploadProgressMap[key]) {
      if (key === 'petition') {
        const oldPetitionDocument = originalCase.docketEntries.find(
          document =>
            document.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode,
        );

        await applicationContext
          .getUseCases()
          .uploadDocumentAndMakeSafeInteractor(applicationContext, {
            document: fileUploadProgressMap[key].file,
            key: oldPetitionDocument.docketEntryId,
            onUploadProgress: fileUploadProgressMap[key].uploadProgress,
          });
      } else {
        const newDocketEntryId = await applicationContext
          .getUseCases()
          .uploadDocumentAndMakeSafeInteractor(applicationContext, {
            document: fileUploadProgressMap[key].file,
            onUploadProgress: fileUploadProgressMap[key].uploadProgress,
          });

        let { documentTitle, documentType } = INITIAL_DOCUMENT_TYPES[key];

        if (
          fileKey === INITIAL_DOCUMENT_TYPES_FILE_MAP.requestForPlaceOfTrial
        ) {
          documentTitle = applicationContext
            .getUtilities()
            .replaceBracketed(documentTitle, caseToUpdate.preferredTrialCity);
        }

        caseToUpdate.docketEntries.push({
          docketEntryId: newDocketEntryId,
          documentTitle,
          documentType,
        });
      }
    }
  }

  const caseDetail = await applicationContext
    .getUseCases()
    .saveCaseDetailInternalEditInteractor(applicationContext, {
      caseToUpdate,
    });

  if (caseDetail.status === STATUS_TYPES.generalDocketReadyForTrial) {
    await applicationContext
      .getUseCases()
      .updateCaseTrialSortTagsInteractor(applicationContext, {
        docketNumber: caseDetail.docketNumber,
      });
  }

  return {
    alertSuccess: {
      message: `Case ${caseDetail.docketNumber} updated.`,
    },
    caseDetail,
  };
};
