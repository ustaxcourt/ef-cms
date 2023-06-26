import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.form using the statistic from the caseDetail
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setEditDeficiencyStatisticFormAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const statistics = get(state.caseDetail.statistics);
  const { statisticId } = props;

  const statisticToEdit = statistics.find(
    statistic => statistic.statisticId === statisticId,
  );

  if (statisticToEdit.lastDateOfPeriod) {
    const deconstructedLastDateOfPeriod = applicationContext
      .getUtilities()
      .deconstructDate(statisticToEdit.lastDateOfPeriod);

    if (deconstructedLastDateOfPeriod) {
      statisticToEdit.lastDateOfPeriodMonth =
        deconstructedLastDateOfPeriod.month;
      statisticToEdit.lastDateOfPeriodDay = deconstructedLastDateOfPeriod.day;
      statisticToEdit.lastDateOfPeriodYear = deconstructedLastDateOfPeriod.year;
    }
  }

  store.set(state.form, {
    ...statisticToEdit,
  });
};
