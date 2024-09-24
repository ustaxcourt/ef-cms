import { post } from '../requests';

export const generateSuggestedTrialSessionCalendarInteractor = (
  applicationContext,
  { termEndDate, termName, termStartDate },
) => {
  return post({
    applicationContext,
    body: {
      termEndDate,
      termName,
      termStartDate,
    },
    endpoint: '/trial-sessions/generate-term',
  });
};
