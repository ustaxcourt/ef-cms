import { state } from '@web-client/presenter/app.cerebral';

export const setupFilesForCaseCreationAction = ({
  get,
}: ActionProps<{
  files: any;
}>) => {
  const petitionMetadata = get(state.form);
  const {
    applicationForWaiverOfFilingFeeFile,
    attachmentToPetitionFile, // paper petition
    attachmentToPetitionFiles, // electronic petition
    corporateDisclosureFile,
    petitionFile,
    primaryDocumentFile,
    requestForPlaceOfTrialFile,
    stinFile,
  } = petitionMetadata;

  return {
    files: {
      applicationForWaiverOfFilingFee: applicationForWaiverOfFilingFeeFile,
      atp: attachmentToPetitionFile,
      atps: attachmentToPetitionFiles,
      corporateDisclosure: corporateDisclosureFile,
      petition: petitionFile,
      primary: primaryDocumentFile,
      requestForPlaceOfTrial: requestForPlaceOfTrialFile,
      stin: stinFile,
    },
  };
};
