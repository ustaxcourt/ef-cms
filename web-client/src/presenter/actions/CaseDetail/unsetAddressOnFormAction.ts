import { state } from 'cerebral';

/**
 * unsets state.form address fields and state.screenMetadata.petitionerAddresses
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store function
 */
export const unsetAddressOnFormAction = ({ store }) => {
  store.unset(state.form.contact.address1);
  store.unset(state.form.contact.address2);
  store.unset(state.form.contact.address3);
  store.unset(state.form.contact.city);
  store.unset(state.form.contact.state);
  store.unset(state.form.contact.postalCode);
  store.unset(state.form.contact.country);
  store.unset(state.form.contact.countryType);

  store.unset(state.screenMetadata.petitionerAddresses);
};
