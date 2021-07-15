import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * sets state.form.contact address fields from props.caseDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setSelectedPetitionerAddressAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const caseDetail = cloneDeep(get(state.caseDetail));

  const petitioner = applicationContext
    .getUtilities()
    .getPetitionerById(caseDetail, props.contactId);

  store.set(state.form.contact.address1, petitioner.address1);
  store.set(state.form.contact.address2, petitioner.address2);
  store.set(state.form.contact.address3, petitioner.address3);
  store.set(state.form.contact.city, petitioner.city);
  store.set(state.form.contact.state, petitioner.state);
  store.set(state.form.contact.postalCode, petitioner.postalCode);
  store.set(state.form.contact.country, petitioner.country);
  store.set(state.form.contact.countryType, petitioner.countryType);
};
