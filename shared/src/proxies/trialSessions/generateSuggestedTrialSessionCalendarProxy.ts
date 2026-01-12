import { CalendarGeneratorMessage } from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';
import { post } from '../requests';
import { RawGenerateSuggestedTermForm } from '@shared/business/entities/trialSessions/GenerateSuggestedTermForm';

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
  }: RawGenerateSuggestedTermForm,
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
