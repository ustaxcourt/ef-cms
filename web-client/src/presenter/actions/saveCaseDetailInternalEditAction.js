import { setupPercentDone } from './createCaseFromPaperAction';
import { state } from 'cerebral';

/**
 * takes the state.caseDetail and updates it via the updateCase use case.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the updateCase use case
 * @param {object} providers.get the cerebral store used for getting state.caseDetail
 * @param {object} providers.props the cerebral store used for getting props.formWithComputedDates
 * @returns {object} the alertSuccess and the caseDetail
 */
export const saveCaseDetailInternalEditAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const {
    INITIAL_DOCUMENT_TYPES,
    INITIAL_DOCUMENT_TYPES_FILE_MAP,
    STATUS_TYPES,
  } = applicationContext.getConstants();
  const originalCase = get(state.caseDetail);
  const caseToUpdate = props.formWithComputedDates;

  const keys = Object.keys(INITIAL_DOCUMENT_TYPES);

  const progressFunctions = setupPercentDone(
    {
      applicationForWaiverOfFilingFeeFile:
        caseToUpdate['applicationForWaiverOfFilingFeeFile'],
      ownershipDisclosureFile: caseToUpdate['ownershipDisclosureFile'],
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
