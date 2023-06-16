import { state } from '@web-client/presenter/app.cerebral';

/**
 * used to clear contact fields when the countryType changes
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const contactPrimaryCountryTypeChangeAction = ({
  store,
}: ActionProps) => {
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
    store.unset(state.form.contactPrimary[field]);
  });

  store.set(state.validationErrors.contactPrimary, {});
};
