import { Statistic } from '../entities/Statistic';
import { TValidationError } from '@shared/business/entities/joiValidationEntity/helper';

export const validateAddDeficiencyStatisticsInteractor = (
  applicationContext: IApplicationContext,
  { statistic }: { statistic: any },
): TValidationError | null => {
  return new Statistic(statistic, {
    applicationContext,
  }).getValidationErrors();
};
