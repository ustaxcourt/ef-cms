import { Statistic } from '../entities/Statistic';

export const validateAddDeficiencyStatisticsInteractor = (
  applicationContext: IApplicationContext,
  { statistic }: { statistic: any },
) => {
  return new Statistic(statistic, {
    applicationContext,
  }).getFormattedValidationErrors();
};
