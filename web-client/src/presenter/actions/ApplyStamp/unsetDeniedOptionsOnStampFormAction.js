import { state } from 'cerebral';

/**
 * unsets state.form denied option fields
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store function
 */
export const unsetDeniedOptionsOnStampFormAction = ({ get, store }) => {
  const stampOrderStatus = get(state.form.status);

  if (stampOrderStatus === 'Granted') {
    store.unset(state.form.deniedWithoutPrejudice);
    store.unset(state.form.deniedAsMoot);
  }
};
