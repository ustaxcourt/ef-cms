import { state } from '@web-client/presenter/app.cerebral';

export const updatedSetupFilesForCaseCreationAction = ({
  get,
}: ActionProps) => {
  const petitionMetadata = get(state.petitionFormatted);
  const {
    applicationForWaiverOfFilingFeeFile,
    corporateDisclosureFile,
    hasIrsNotice,
    irsNotices,
    petitionFile,
    primaryDocumentFile,
    requestForPlaceOfTrialFile,
    stinFile,
  } = petitionMetadata;
  const attachmentsToPetition =
    hasIrsNotice && irsNotices?.map(irsNotice => irsNotice.file);

  const files = {
    applicationForWaiverOfFilingFee: applicationForWaiverOfFilingFeeFile,
    attachmentToPetition: attachmentsToPetition,
    corporateDisclosure: corporateDisclosureFile,
    petition: petitionFile || undefined,
    primary: primaryDocumentFile,
    requestForPlaceOfTrial: requestForPlaceOfTrialFile,
    stin: stinFile,
  };

  return {
    files,
  };
};
