import { ElectronicCreatedCaseType } from '@shared/business/useCases/createCaseInteractor';
import { post } from './requests';

export const createCaseInteractor = (
  applicationContext,
  requestBody: {
    attachmentToPetitionFileId: string;
    corporateDisclosureFileId: string;
    petitionFileId: string;
    petitionMetadata: ElectronicCreatedCaseType;
    stinFileId: string;
  },
): Promise<RawCase> => {
  return post({
    applicationContext,
    body: requestBody,
    endpoint: '/cases',
  });
};
