import { Penalty } from '../entities/Penalty';

export const validatePenaltiesInteractor = ({
  rawPenalty,
}: {
  rawPenalty: object;
}): Record<string, string> | null => {
  return new Penalty(rawPenalty).getFormattedValidationErrors();
};
