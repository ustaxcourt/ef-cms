import { Statistic } from '../entities/Statistic';

export const validateAddDeficiencyStatisticsInteractor = (
  { statistic }: { statistic: any },
) => {
  return new Statistic(statistic).getFormattedValidationErrors();
};
