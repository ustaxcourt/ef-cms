import { state } from 'cerebral';

/**
 * Used for changing which work queue (myself, section) and box (inbox, outbox).
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting workQueueToDisplay
 */
export const countryTypeChangeAction = ({ store }) => {
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
    store.set(state.caseDetail.contactPrimary[field], undefined);
  });

  store.set(state.validationErrors.contactPrimary, {});
};
