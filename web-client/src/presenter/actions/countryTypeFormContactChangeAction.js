import { state } from 'cerebral';

/**
 * unsets form contact info when countryType changes
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const countryTypeFormContactChangeAction = ({ store }) => {
  [
    'address1',
    'address2',
    'address3',
    'country',
    'postalCode',
    'phone',
    'state',
    'city',
  ].forEach(field => {
    store.unset(state.form.contact[field]);
  });

  store.set(state.validationErrors.contact, {});
};
