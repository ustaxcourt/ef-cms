import { PARTY_TYPES } from '@shared/business/entities/EntityConstants';
import { showContactsHelperUpdated } from '@web-client/presenter/computeds/showContactsHelperUpdated';
import { state } from '@web-client/presenter/app.cerebral';

export const setDefaultContactStateAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps<{
  key: string;
  value: string;
}>) => {
  const partyType = get(state.form.partyType);

  const { showContactPrimary, showContactSecondary } =
    showContactsHelperUpdated(partyType, PARTY_TYPES, props);

  const { COUNTRY_TYPES } = applicationContext.getConstants();

  const defaultContact = showContactPrimary
    ? { countryType: COUNTRY_TYPES.DOMESTIC }
    : {};

  if (props.key === 'filingType') {
    // toggling filing type
    store.set(state.form.contactPrimary, defaultContact);
    store.unset(state.form.contactSecondary);
    store.unset(state.form.useSameAsPrimary);
    store.unset(state.form.isSpouseDeceased);
    store.unset(state.form.hasSpouseConsent);
  }

  if (showContactSecondary) {
    // spouse deceased
    store.set(state.form.contactSecondary, {});
    store.set(state.form.useSameAsPrimary, true);
    store.set(state.form.hasSpouseConsent, false);
  } else {
    store.set(state.form.contactSecondary, {});
    store.set(state.form.hasSpouseConsent, false);
    store.set(state.form.useSameAsPrimary, false);
  }
};
