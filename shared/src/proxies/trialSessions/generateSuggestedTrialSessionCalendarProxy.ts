import { post } from '../requests';

export const generateSuggestedTrialSessionCalendarInteractor = (
  applicationContext,
  { termEndDate, termStartDate },
) => {
  return post({
    applicationContext,
    body: {
      termEndDate,
      termStartDate,
    },
    endpoint: '/trial-sessions/generate-term',
  });
};
