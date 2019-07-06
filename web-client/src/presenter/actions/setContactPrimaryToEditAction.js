import { state } from 'cerebral';

/**
 * sets the state.contactToEdit based on the props.caseTypes passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store used for setting the state.contactToEdit
 */

export const setContactPrimaryToEditAction = ({ get, store }) => {
  const contactPrimary = get(state.caseDetail.contactPrimary);
  store.set(state.contactToEdit, {
    contactPrimary: { ...contactPrimary },
  });
};
