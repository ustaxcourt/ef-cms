import { state } from 'cerebral';

/**
 * sets the state.form to the props.value passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.get the cerebral get method
 */
export const updateOrderForDesignatingPlaceOfTrialAction = ({ get, store }) => {
  const preferredTrialCity = get(state.form.preferredTrialCity);
  const requestForPlaceOfTrialFile = get(state.form.requestForPlaceOfTrialFile);

  if (!preferredTrialCity && !requestForPlaceOfTrialFile) {
    store.set(state.form.orderForRequestedTrialLocation, true);
  } else {
    store.set(state.form.orderForRequestedTrialLocation, false);
  }
};
