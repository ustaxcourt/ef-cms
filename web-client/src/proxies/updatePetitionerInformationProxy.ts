import { put } from './requests';
import type { AggregatedPaperServiceParty } from '@shared/business/utilities/aggregatePartiesForService';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const updatePetitionerInformationInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, updatedPetitionerData },
): Promise<{
  updatedCase: CaseDTO;
  paperServiceParties: AggregatedPaperServiceParty[];
  paperServicePdfUrl: string | undefined;
}> => {
  return put({
    applicationContext,
    body: { updatedPetitionerData },
    endpoint: `/case-parties/${docketNumber}/petitioner-info`,
  });
};
