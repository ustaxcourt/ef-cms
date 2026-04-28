import { RawUser } from '@shared/business/entities/User';
import { get } from '../requests';

/**
 * getJudgeInSectionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.section the section to find the judge in
 * @returns {Promise<*>} the promise of the api call
 */
export const getJudgeInSectionInteractor = (
  applicationContext,
  { section },
): Promise<RawUser> => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/judge`,
  });
};
