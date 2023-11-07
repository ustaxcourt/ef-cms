import { Penalty } from '../entities/Penalty';

export const validatePenaltiesInteractor = (
  applicationContext: IApplicationContext,
  { rawPenalty }: { rawPenalty: object },
): Record<string, string> | null => {
  return new Penalty(rawPenalty, {
    applicationContext,
  }).getFormattedValidationErrors();
};
