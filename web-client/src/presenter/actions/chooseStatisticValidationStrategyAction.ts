import { state } from '@web-client/presenter/app.cerebral';

export const chooseStatisticValidationStrategyAction = ({
  get,
  path,
}: ActionProps) => {
  const statisticIndex = get(state.modal.statisticIndex);
  if (statisticIndex >= 0) {
    const isPaper = get(state.form.isPaper);
    return isPaper ? path.startCase() : path.caseDetail();
  }
  return path.addEditStatistic();
};
