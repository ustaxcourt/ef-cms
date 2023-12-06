import { state } from '@web-client/presenter/app.cerebral';

/**
 * clears the form values if the yearOrPeriod value changes
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const clearAddDeficiencyFormValuesAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  if (props.key.includes('yearOrPeriod')) {
    const statistic = get(state.form);
    store.set(state.form, {
      statisticId: statistic.statisticId,
      yearOrPeriod: props.value,
    });
  }
};
