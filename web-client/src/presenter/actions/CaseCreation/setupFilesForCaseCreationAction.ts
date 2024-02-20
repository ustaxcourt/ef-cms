import { state } from '@web-client/presenter/app.cerebral';

export const setupFilesForCaseCreationAction = ({
  get,
}: ActionProps<{
  files: any;
}>) => {
  const petitionMetadata = get(state.form);
  const {
    applicationForWaiverOfFilingFeeFile,
    attachmentToPetitionFiles,
    corporateDisclosureFile,
    petitionFile,
    primaryDocumentFile,
    requestForPlaceOfTrialFile,
    stinFile,
  } = petitionMetadata;

  return {
    files: {
      applicationForWaiverOfFilingFee: applicationForWaiverOfFilingFeeFile,
      atps: attachmentToPetitionFiles,
      corporateDisclosure: corporateDisclosureFile,
      petition: petitionFile,
      primaryDocumentFile,
      requestForPlaceOfTrial: requestForPlaceOfTrialFile,
      stin: stinFile,
    },
  };
};
