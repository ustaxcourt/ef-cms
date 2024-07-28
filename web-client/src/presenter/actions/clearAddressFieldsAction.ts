import { state } from '@web-client/presenter/app.cerebral';

export const clearAddressFieldsAction = ({ props, store }: ActionProps) => {
  if (props.type === 'contactPrimary') {
    store.unset(state.form.contactPrimary.country);
    store.unset(state.form.contactPrimary.address1);
    store.unset(state.form.contactPrimary.address2);
    store.unset(state.form.contactPrimary.address3);
    store.unset(state.form.contactPrimary.city);
    store.unset(state.form.contactPrimary.state);
    store.unset(state.form.contactPrimary.postalCode);
    store.unset(state.form.contactPrimary.placeOfLegalResidence);
  }
  if (props.type === 'contactSecondary') {
    store.unset(state.form.contactSecondary.country);
    store.unset(state.form.contactSecondary.address1);
    store.unset(state.form.contactSecondary.address2);
    store.unset(state.form.contactSecondary.address3);
    store.unset(state.form.contactSecondary.city);
    store.unset(state.form.contactSecondary.state);
    store.unset(state.form.contactSecondary.postalCode);
    store.unset(state.form.contactSecondary.placeOfLegalResidence);
  }
};
