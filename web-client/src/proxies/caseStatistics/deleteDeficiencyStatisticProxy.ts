import { remove } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const deleteDeficiencyStatisticInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, statisticId },
): Promise<CaseDTO> => {
  return remove({
    applicationContext,
    endpoint: `/case-meta/${docketNumber}/statistics/${statisticId}`,
  });
};
