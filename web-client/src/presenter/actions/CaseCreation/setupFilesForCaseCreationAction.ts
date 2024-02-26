import { state } from '@web-client/presenter/app.cerebral';

export const setupFilesForCaseCreationAction = ({ get }: ActionProps) => {
  const petitionMetadata = get(state.form);
  const {
    applicationForWaiverOfFilingFeeFile,
    attachmentToPetitionFile,
    corporateDisclosureFile,
    petitionFile,
    requestForPlaceOfTrialFile,
    stinFile,
  } = petitionMetadata;

  return {
    files: {
      applicationForWaiverOfFilingFee: applicationForWaiverOfFilingFeeFile,
      attachmentToPetition: attachmentToPetitionFile,
      corporateDisclosure: corporateDisclosureFile,
      petition: petitionFile,
      requestForPlaceOfTrial: requestForPlaceOfTrialFile,
      stin: stinFile,
    },
  };
};
