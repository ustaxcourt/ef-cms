import { ClientApplicationContext } from '@web-client/applicationContext';
import { ValidateCaseForNewMinuteSheetResult } from '@web-api/business/useCases/trialSessionMinutes/validateCaseForNewMinuteSheetInteractor';
import { get } from '../requests';

export const validateCaseForNewMinuteSheetInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, trialSessionId }: { docketNumber: string; trialSessionId: string },
): Promise<ValidateCaseForNewMinuteSheetResult> => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/validate-case-for-minute-sheet`,
    params: { docketNumber },
  });
};
