import { setupPercentDone } from './createCaseFromPaperAction';
import { state } from '@web-client/presenter/app.cerebral';

export const saveCaseDetailInternalEditAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const {
    INITIAL_DOCUMENT_TYPES,
    INITIAL_DOCUMENT_TYPES_FILE_MAP,
    STATUS_TYPES,
  } = applicationContext.getConstants();
  const originalCase = get(state.caseDetail);
  const caseToUpdate = get(state.form);

  const keys = Object.keys(INITIAL_DOCUMENT_TYPES);

  const progressFunctions = setupPercentDone(
    {
      applicationForWaiverOfFilingFeeFile:
        caseToUpdate['applicationForWaiverOfFilingFeeFile'],
      attachmentToPetitionFile: caseToUpdate['attachmentToPetitionFile'],
      corporateDisclosureFile: caseToUpdate['corporateDisclosureFile'],
      petitionFile: caseToUpdate['petitionFile'],
      requestForPlaceOfTrialFile: caseToUpdate['requestForPlaceOfTrialFile'],
      stinFile: caseToUpdate['stinFile'],
    },
    store,
  );

  for (const key of keys) {
    const fileKey = INITIAL_DOCUMENT_TYPES_FILE_MAP[key];
    if (caseToUpdate[fileKey]) {
      if (fileKey === 'petitionFile') {
        const oldPetitionDocument = originalCase.docketEntries.find(
          document =>
            document.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode,
        );

        await applicationContext
          .getUseCases()
          .uploadDocumentAndMakeSafeInteractor(applicationContext, {
            document: caseToUpdate[fileKey],
            key: oldPetitionDocument.docketEntryId,
            onUploadProgress: progressFunctions[fileKey],
          });
      } else {
        const newDocketEntryId = await applicationContext
          .getUseCases()
          .uploadDocumentAndMakeSafeInteractor(applicationContext, {
            document: caseToUpdate[fileKey],
            onUploadProgress: progressFunctions[fileKey],
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
