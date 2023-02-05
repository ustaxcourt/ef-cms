import { Penalty } from '../entities/Penalty';
import { isEmpty } from 'lodash';

/**
 * validatePenaltiesInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.rawPenalty the penalty to validate
 * @returns {object} errors (undefined if no errors)
 */
export const validatePenaltiesInteractor = (
  applicationContext: IApplicationContext,
  { rawPenalty }: { rawPenalty: object },
) => {
  const penaltyErrors = new Penalty(rawPenalty, {
    applicationContext,
  }).getFormattedValidationErrors();

  return !isEmpty(penaltyErrors) ? penaltyErrors : undefined;
};
