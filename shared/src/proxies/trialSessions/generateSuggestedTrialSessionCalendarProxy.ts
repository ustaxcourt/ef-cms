import { CalendarGeneratorMessage } from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';
import { post } from '../requests';
import { CreateTermParams } from '@shared/types/CreateTermParams';

export const generateSuggestedTrialSessionCalendarInteractor = (
  applicationContext,
  {
    termEndDate,
    termStartDate,
    maxSessionsPerLocation,
    maxSessionsPerWeek,
    smallCaseMinimumQuantity,
    smallCaseMaxQuantity,
    regularCaseMinimumQuantity,
    regularCaseMaxQuantity,
    hybridCaseMinimumQuantity,
    hybridCaseMaxQuantity,
  }: CreateTermParams,
): Promise<{
  message: CalendarGeneratorMessage;
  bufferArray: Buffer | undefined;
}> => {
  return post({
    applicationContext,
    body: {
      termEndDate,
      termStartDate,
      maxSessionsPerLocation,
      maxSessionsPerWeek,
      smallCaseMinimumQuantity,
      smallCaseMaxQuantity,
      regularCaseMinimumQuantity,
      regularCaseMaxQuantity,
      hybridCaseMinimumQuantity,
      hybridCaseMaxQuantity,
    },
    endpoint: '/trial-sessions/generate-term',
  });
};
