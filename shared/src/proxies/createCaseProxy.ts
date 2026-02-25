import { ElectronicCreatedCaseType } from '@web-api/business/useCases/createCaseInteractor';
import { post } from './requests';

export const createCaseInteractor = (
  applicationContext,
  requestBody: {
    attachmentToPetitionFileIds: string[];
    corporateDisclosureFileId: string;
    petitionFileId: string;
    petitionMetadata: ElectronicCreatedCaseType;
    stinFileId: string;
  },
): Promise<{ docketNumber: string; docketNumberWithSuffix: string; docketEntryIds: string[] }> => {
  return post({
    applicationContext,
    body: requestBody,
    endpoint: '/cases',
  });
};
