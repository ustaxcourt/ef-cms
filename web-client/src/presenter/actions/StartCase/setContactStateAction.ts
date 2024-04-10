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
  const { COUNTRY_TYPES } = applicationContext.getConstants();

  const partyType = get(state.form.partyType);

  const { showContactPrimary, showContactSecondary } =
    showContactsHelperUpdated(partyType, PARTY_TYPES, props.value);

  store.set(
    state.form.contactPrimary,
    getDefaultContactState(showContactPrimary, COUNTRY_TYPES),
  );
  store.set(
    state.form.contactSecondary,
    getDefaultContactState(showContactSecondary, COUNTRY_TYPES),
  );

  store.unset(state.form.useSameAsPrimary);
};

function getDefaultContactState(showContact, COUNTRY_TYPES) {
  if (showContact) return { countryType: COUNTRY_TYPES.DOMESTIC };
  return {};
}
