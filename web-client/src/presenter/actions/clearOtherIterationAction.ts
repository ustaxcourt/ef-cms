import { state } from '@web-client/presenter/app.cerebral';

/**
 * clears the value of state.<form>.otherIteration when otherIteration exists but ordinalValue is not "Other"
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @param {object} providers.store the cerebral store object
 */
export const clearOtherIterationAction = ({ get, store }: ActionProps) => {
  if (
    get(state.form.otherIteration) &&
    get(state.form.ordinalValue) !== 'Other'
  ) {
    store.unset(state.form.otherIteration);
  }
};
