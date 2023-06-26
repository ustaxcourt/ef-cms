import { state } from '@web-client/presenter/app.cerebral';

/**
 * used for when the country type is changed on the edit user contact info sequence.
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const countryTypeUserContactChangeAction = ({ store }: ActionProps) => {
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
    store.unset(state.user.contact[field]);
  });

  store.set(state.validationErrors.contact, {});
};
