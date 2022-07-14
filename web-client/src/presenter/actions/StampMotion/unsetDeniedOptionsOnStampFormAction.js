import { state } from 'cerebral';

/**
 * unsets state.form denied option fields
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store function
 */
export const unsetDeniedOptionsOnStampFormAction = ({
  applicationContext,
  get,
  store,
}) => {
  const stampOrderStatus = get(state.form.status);
  const { MOTION_STATUSES } = applicationContext.getConstants();

  if (stampOrderStatus === MOTION_STATUSES.GRANTED) {
    store.unset(state.form.deniedWithoutPrejudice);
    store.unset(state.form.deniedAsMoot);
  }
};
