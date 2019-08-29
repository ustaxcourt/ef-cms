import { state } from 'cerebral';

/**
 * used for when the country type is changed on the edit user contact info sequence.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting workQueueToDisplay
 */
export const countryTypeUserContactChangeAction = ({ store }) => {
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
    store.set(state.user.contact[field], undefined);
  });

  store.set(state.validationErrors.contact, {});
};
