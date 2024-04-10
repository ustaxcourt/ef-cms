import { PARTY_TYPES } from '@shared/business/entities/EntityConstants';
import { showContactsHelperUpdated } from '@web-client/presenter/computeds/showContactsHelperUpdated';
import { state } from '@web-client/presenter/app.cerebral';

export const setContactStateAction = ({
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

  if (showContactSecondary && props.key === 'isSpouseDeceased') {
    store.set(state.form.useSameAsPrimary, true);
  } else {
    store.unset(state.form.useSameAsPrimary);
  }

  // only reset the address if the filing type is updated
  if (props.key !== 'filingType') return;

  const { COUNTRY_TYPES } = applicationContext.getConstants();

  store.set(
    state.form.contactPrimary,
    getDefaultContactState(showContactPrimary, COUNTRY_TYPES),
  );
  store.set(
    state.form.contactSecondary,
    getDefaultContactState(showContactSecondary, COUNTRY_TYPES),
  );
};

function getDefaultContactState(showContact, COUNTRY_TYPES) {
  if (showContact) return { countryType: COUNTRY_TYPES.DOMESTIC };
  return {};
}
