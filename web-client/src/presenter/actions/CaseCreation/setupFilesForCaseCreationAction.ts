import { state } from '@web-client/presenter/app.cerebral';

export const setupFilesForCaseCreationAction = ({ get }: ActionProps) => {
  const petitionMetadata = get(state.form);
  const {
    applicationForWaiverOfFilingFeeFile,
    attachmentToPetitionFile,
    corporateDisclosureFile,
    petitionFile,
    primaryDocumentFile,
    requestForPlaceOfTrialFile,
    stinFile,
  } = petitionMetadata;

  return {
    files: {
      applicationForWaiverOfFilingFee: applicationForWaiverOfFilingFeeFile,
      attachmentToPetition: attachmentToPetitionFile,
      corporateDisclosure: corporateDisclosureFile,
      petition: petitionFile,
      primary: primaryDocumentFile,
      requestForPlaceOfTrial: requestForPlaceOfTrialFile,
      stin: stinFile,
    },
  };
};
