import { CalendarGeneratorMessage } from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';
import { post } from '../requests';

export const generateSuggestedTrialSessionCalendarInteractor = (
  applicationContext,
  { termEndDate, termStartDate },
): Promise<{
  message: CalendarGeneratorMessage;
  bufferArray: Buffer | undefined;
}> => {
  return post({
    applicationContext,
    body: {
      termEndDate,
      termStartDate,
    },
    endpoint: '/trial-sessions/generate-term',
  });
};
