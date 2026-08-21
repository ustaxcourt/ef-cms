import { CreatedCaseType } from '@shared/business/entities/EntityConstants';
import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { post } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const createCaseFromPaperInteractor = (
  applicationContext: ClientApplicationContext,
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
    petitionMetadata: CreatedCaseType;
    requestForPlaceOfTrialFileId: string;
    stinFileId: string;
  },
): Promise<{ caseDetail: CaseDTO; workItem: RawWorkItem }> => {
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
