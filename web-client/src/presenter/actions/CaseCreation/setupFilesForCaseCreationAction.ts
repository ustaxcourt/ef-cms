import { state } from '@web-client/presenter/app.cerebral';

export const setupFilesForCaseCreationAction = ({
  get,
}: ActionProps<{
  files: any;
}>) => {
  const petitionMetadata = get(state.form);
  const {
    applicationForWaiverOfFilingFeeFile,
    attachmentToPetitionFiles, // make sure its the same name in paper flow
    corporateDisclosureFile,
    petitionFile,
    requestForPlaceOfTrialFile,
    stinFile,
  } = petitionMetadata;

  return {
    files: {
      applicationForWaiverOfFilingFee: applicationForWaiverOfFilingFeeFile,
      atps: attachmentToPetitionFiles,
      corporateDisclosure: corporateDisclosureFile,
      petition: petitionFile,
      requestForPlaceOfTrial: requestForPlaceOfTrialFile,
      stin: stinFile,
    },
  };
};
