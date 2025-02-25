import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { get } from '../requests';

/**
 * getTrialSessionsInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
export const getTrialSessionsInteractor = (
  applicationContext,
): Promise<TrialSessionInfoDTO[]> => {
  return get({
    applicationContext,
    endpoint: '/trial-sessions',
  });
};
