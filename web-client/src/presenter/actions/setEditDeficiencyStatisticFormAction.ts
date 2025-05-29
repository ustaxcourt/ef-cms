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
  get,
  props,
  store,
}: ActionProps) => {
  const { docketNumber, statistics } = get(state.caseDetail);
  const { statisticId } = props;

  if (!statistics || !statistics.length) {
    throw new Error(
      `Failed to edit statistic: Case ${docketNumber} does not have any statistics`,
    );
  }

  const statisticToEdit = statistics.find(
    statistic => statistic.statisticId === statisticId,
  );

  if (!statisticToEdit) {
    throw new Error(
      `Failed to edit statistic: Case ${docketNumber} does not have any statistic with ID ${statisticId}`,
    );
  }

  store.set(state.form, {
    ...statisticToEdit,
  });
};
