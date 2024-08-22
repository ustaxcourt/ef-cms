import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the current user on state.form.practitioner if that user is a practitioner
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const setPractitionerOnFormAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const user = get(state.user);
  const { USER_ROLES } = applicationContext.getConstants();

  if (user.role === USER_ROLES.privatePractitioner) {
    store.set(state.form.practitioner, [
      { ...user, partyPrivatePractitioner: true },
    ]);
  }
};
