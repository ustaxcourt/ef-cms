import { SESSION_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { scheduleTrialSessions } from '@web-api/business/useCaseHelper/trialSessions/scheduleTrialSessions';

export const generateSuggestedTrialSessionCalendarInteractor = async (
  applicationContext: ServerApplicationContext,
  { endDate, startDate }: { endDate: string; startDate: string },
) => {
  //
  // Maximum of 6 sessions per week
  // Maximum of 5 sessions total per location
  // Regular: 40 regular cases minimum to create a session and a maximum of 100 per session
  // Small: 40 small cases minimum to create a session and a maximum of 125 per session
  // Hybrid: After Small and Regular sessions are created, if small and regular cases can be added together to meet a minimum of 50, create a hybrid session. Maximum will be 100 cases per session
  // Special sessions already created will be automatically included
  // If there has been no trial in the last two terms for a location, then add a session if there are any cases. (ignore the minimum rule)
  //

  const cases = await applicationContext
    .getPersistenceGateway()
    .getReadyForTrialCases({ applicationContext });
  const sessions = await applicationContext
    .getPersistenceGateway()
    .getTrialSessions({ applicationContext });

  const specialSessions = sessions.filter(
    session => session.sessionType === SESSION_TYPES.special,
  );

  return scheduleTrialSessions({ cases, endDate, specialSessions, startDate });
};
