import { state } from 'cerebral';

export const petitionQcHelper = (get, applicationContext) => {
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();

  const documentTypeMap = {
    applicationForWaiverOfFilingFeeFile:
      INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.documentType,
    ownershipDisclosureFile:
      INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
    petitionFile: INITIAL_DOCUMENT_TYPES.petition.documentType,
    requestForPlaceOfTrialFile:
      INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
    stinFile: INITIAL_DOCUMENT_TYPES.stin.documentType,
  };
  const documentSelectedForPreview = get(
    state.currentViewMetadata.documentSelectedForPreview,
  );

  const documentTypeSelectedForPreview =
    documentTypeMap[documentSelectedForPreview];

  const isPetitionFile =
    documentTypeSelectedForPreview === documentTypeMap.petitionFile;

  return { isPetitionFile };
};
