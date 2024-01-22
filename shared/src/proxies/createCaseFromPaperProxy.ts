import { post } from './requests';

export const createCaseFromPaperInteractor = (
  applicationContext,
  {
    applicationForWaiverOfFilingFeeFileId,
    attachmentToPetitionFileId,
    corporateDisclosureFileId,
    petitionFileId,
    petitionMetadata,
    requestForPlaceOfTrialFileId,
    stinFileId,
  }: {
    applicationForWaiverOfFilingFeeFileId: string;
    attachmentToPetitionFileId: string;
    corporateDisclosureFileId: string;
    petitionFileId: string;
    petitionMetadata: any; // TODO: add types
    requestForPlaceOfTrialFileId: string;
    stinFileId: string;
  },
): Promise<RawCase> => {
  return post({
    applicationContext,
    body: {
      applicationForWaiverOfFilingFeeFileId,
      attachmentToPetitionFileId,
      corporateDisclosureFileId,
      petitionFileId,
      petitionMetadata,
      requestForPlaceOfTrialFileId,
      stinFileId,
    },
    endpoint: '/cases/paper',
  });
};
