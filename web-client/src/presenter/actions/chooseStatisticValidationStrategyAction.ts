import { state } from '@web-client/presenter/app.cerebral';
/**
 * Chooses which validation path the penalties form takes based on whether
 * the case is being started or a statistic edited
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} next path based on if modal has statistic index
 */
export const chooseStatisticValidationStrategyAction = ({
  get,
  path,
}: ActionProps) => {
  return get(state.modal.statisticIndex) >= 0
    ? path.startCase()
    : path.addEditStatistic();
};
