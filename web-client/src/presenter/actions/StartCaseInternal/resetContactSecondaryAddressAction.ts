import { state } from '@web-client/presenter/app.cerebral';

export const resetContactSecondaryAddressAction = ({ store }: ActionProps) => {
  store.unset(state.form.contactSecondary.address1);
  store.unset(state.form.contactSecondary.address2);
  store.unset(state.form.contactSecondary.address3);
  store.unset(state.form.contactSecondary.city);
  store.unset(state.form.contactSecondary.phone);
  store.unset(state.form.contactSecondary.placeOfLegalResidence);
  store.unset(state.form.contactSecondary.postalCode);
  store.unset(state.form.contactSecondary.state);
};
