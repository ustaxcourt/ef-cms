import { state } from 'cerebral';

export const setContactPrimaryToEditAction = ({ get, store }) => {
  const contactPrimary = get(state.caseDetail.contactPrimary);
  store.set(state.contactToEdit, {
    contactPrimary: { ...contactPrimary },
  });
};
