import { ElectronicCreatedCaseType } from '@web-api/business/useCases/createCaseInteractor';
import { post } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const createCaseInteractor = (
  applicationContext: ClientApplicationContext,
  requestBody: {
    attachmentToPetitionFileIds: string[];
    corporateDisclosureFileId: string;
    petitionFileId: string;
    petitionMetadata: ElectronicCreatedCaseType;
    stinFileId: string;
  },
): Promise<CaseDTO> => {
  return post({
    applicationContext,
    body: requestBody,
    endpoint: '/cases',
  });
};
