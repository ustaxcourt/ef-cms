import { state } from 'cerebral';

/**
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object used for passing props.date
 * @param {object} providers.store the cerebral store used for setting the state.customCaseInventoryFilters.createStartDate or state.customCaseInventoryFilters.createEndDate
 */
export const setStartOrEndCreatedAtDateAction = ({ props, store }) => {
  const { date, startOrEnd } = props;

  if (startOrEnd === 'start') {
    store.set(state.customCaseInventoryFilters.createStartDate, date);
  } else if (startOrEnd === 'end') {
    store.set(state.customCaseInventoryFilters.createEndDate, date);
  }
};
