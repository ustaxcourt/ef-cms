import { Statistic } from '../entities/Statistic';

export const validateAddDeficiencyStatisticsInteractor = (
  _applicationContext: IApplicationContext,
  { statistic }: { statistic: any },
) => {
  return new Statistic(statistic).getFormattedValidationErrors();
};
