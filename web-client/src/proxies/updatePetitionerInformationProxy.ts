import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const updatePetitionerInformationInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, updatedPetitionerData },
): Promise<{
  updatedCase: CaseDTO;
  paperServiceParties: any[];
  paperServicePdfUrl: any;
}> => {
  return put({
    applicationContext,
    body: { updatedPetitionerData },
    endpoint: `/case-parties/${docketNumber}/petitioner-info`,
  });
};
