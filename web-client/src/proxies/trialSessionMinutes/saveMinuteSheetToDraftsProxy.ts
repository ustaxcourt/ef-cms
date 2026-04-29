import { applicationContext } from '@web-client/applicationContext';
import { post } from '../requests';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const saveMinuteSheetToDraftsInteractor = ({
  docketNumber,
  trialSessionId,
}): Promise<CaseDTO> => {
  return post({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/case/${docketNumber}/minutes-draft`,
  });
};
