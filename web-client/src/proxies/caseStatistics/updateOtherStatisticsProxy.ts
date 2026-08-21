import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const updateOtherStatisticsInteractor = (
  applicationContext: ClientApplicationContext,
  { damages, docketNumber, litigationCosts },
): Promise<CaseDTO> => {
  return post({
    applicationContext,
    body: { damages, litigationCosts },
    endpoint: `/case-meta/${docketNumber}/other-statistics`,
  });
};
