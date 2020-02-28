import { state } from 'cerebral';

/**
 * get the case inventory report data
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const updateCaseInventoryFilterAction = async ({
  get,
  path,
  props,
  store,
}) => {
  const { associatedJudge, status } = get(state.screenMetadata);

  if (
    !props.value &&
    ((props.key === 'associatedJudge' && !status) ||
      (props.key === 'status' && !associatedJudge))
  ) {
    return path.no({
      alertError: {
        message: 'You must select a filter.',
      },
    });
  }
  store.set(state.screenMetadata[props.key], props.value);
  return path.proceed();
};
