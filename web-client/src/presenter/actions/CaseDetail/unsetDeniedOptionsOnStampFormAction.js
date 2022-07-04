import { state } from 'cerebral';

/**
 * unsets state.form denied option fields
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store function
 */
export const unsetDeniedOptionsOnStampFormAction = ({ store }) => {
  store.unset(state.form.deniedWithoutPrejudice);
  store.unset(state.form.deniedAsMoot);
};
