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

  const attachmentsToPetition: File[] | undefined = hasIrsNotice
    ? (irsNotices
        ?.map(irsNotice => irsNotice.file)
        .filter(file => !!file) as File[])
    : undefined;

  const files = {
    applicationForWaiverOfFilingFee: applicationForWaiverOfFilingFeeFile,
    attachmentToPetition:
      attachmentsToPetition && attachmentsToPetition.length
        ? attachmentsToPetition
        : undefined,
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
