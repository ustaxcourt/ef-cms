import { state } from '@web-client/presenter/app.cerebral';

/**
 * unsets state.form.contactSecondary address fields and state.screenMetadata.petitionerAddresses
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store function
 */
export const unsetContactSecondaryAddressOnFormAction = ({
  store,
}: ActionProps) => {
  store.unset(state.form.contactSecondary.address1);
  store.unset(state.form.contactSecondary.address2);
  store.unset(state.form.contactSecondary.address3);
  store.unset(state.form.contactSecondary.city);
  store.unset(state.form.contactSecondary.state);
  store.unset(state.form.contactSecondary.postalCode);
  store.unset(state.form.contactSecondary.country);
  store.unset(state.form.contactSecondary.phone);

  store.unset(state.screenMetadata.petitionerAddresses);
};
