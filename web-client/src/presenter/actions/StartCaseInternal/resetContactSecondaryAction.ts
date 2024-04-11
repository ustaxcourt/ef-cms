import { state } from '@web-client/presenter/app.cerebral';

export const resetContactSecondaryAction = ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  const { COUNTRY_TYPES } = applicationContext.getConstants();

  const isChecked = props.value;
  if (props.key === 'hasSpouseConsent') {
    if (isChecked) {
      store.set(state.form.contactSecondary, {});
      store.set(state.form.useSameAsPrimary, true);
    } else {
      store.unset(state.form.contactSecondary);
      store.unset(state.form.useSameAsPrimary);
    }
  }
  if (props.key === 'useSameAsPrimary') {
    if (isChecked) {
      store.set(state.form.useSameAsPrimary, true);
      store.unset(state.form.contactSecondary.countryType);
      store.unset(state.form.contactSecondary.address1);
      store.unset(state.form.contactSecondary.address2);
      store.unset(state.form.contactSecondary.address3);
      store.unset(state.form.contactSecondary.city);
      store.unset(state.form.contactSecondary.state);
      store.unset(state.form.contactSecondary.postalCode);
      store.unset(state.form.contactSecondary.country);
      store.unset(state.form.contactSecondary.phone);
    } else {
      store.set(state.form.useSameAsPrimary, false);
      store.set(
        state.form.contactSecondary.countryType,
        COUNTRY_TYPES.DOMESTIC,
      );
    }
  }
};
