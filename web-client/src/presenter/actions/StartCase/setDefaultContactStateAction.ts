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
    showContactsHelperUpdated(partyType, PARTY_TYPES, props.value);

  const { COUNTRY_TYPES } = applicationContext.getConstants();

  if (props.key === 'filingType') {
    store.set(
      state.form.contactPrimary,
      getDefaultContactState(showContactPrimary, COUNTRY_TYPES),
    );
    store.set(
      state.form.contactSecondary,
      getDefaultContactState(showContactSecondary, COUNTRY_TYPES),
    );
    store.unset(state.form.useSameAsPrimary);
    store.unset(state.form.isSpouseDeceased);
    store.unset(state.form.hasSpouseConsent);
  }

  if (showContactSecondary) {
    store.set(
      state.form.contactSecondary,
      getDefaultContactState(showContactSecondary, COUNTRY_TYPES),
    );
    store.set(state.form.useSameAsPrimary, true);
    store.unset(state.form.hasSpouseConsent);
  }
};

function getDefaultContactState(showContact, COUNTRY_TYPES) {
  if (showContact) return { countryType: COUNTRY_TYPES.DOMESTIC };
  return {};
}
