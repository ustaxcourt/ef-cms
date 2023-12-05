import { showContactsHelper } from '../../computeds/showContactsHelper';
import { state } from '@web-client/presenter/app.cerebral';

export const updatePartyTypeAction = ({
  applicationContext,
  props,
  store,
}: ActionProps<{
  key: string;
  value: string;
}>) => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  const updatePartyType = (newPartyType: string) => {
    store.set(state.form.partyType, newPartyType);

    const showContacts = showContactsHelper(newPartyType, PARTY_TYPES);

    ['contactPrimary', 'contactSecondary'].forEach(contact => {
      store.set(
        state.form[contact],
        showContacts[contact]
          ? {
              countryType: COUNTRY_TYPES.DOMESTIC,
            }
          : {},
      );
    });
  };

  if (props.key === 'filingType') {
    if (props.value === 'Myself' || props.value === 'Individual petitioner') {
      updatePartyType(PARTY_TYPES.petitioner);
    }

    if (
      props.value === 'A business' ||
      props.value === 'Other' ||
      props.value === 'Myself and my spouse' ||
      props.value === 'Petitioner and spouse'
    ) {
      store.unset(state.form.partyType);
    }

    if (props.value !== 'A business') {
      store.unset(state.form.corporateDisclosureFile);
      store.unset(state.form.businessType);
    }
    store.unset(state.form.otherType);
    store.unset(state.form.isSpouseDeceased);
    store.unset(state.form.estateType);
    store.unset(state.form.minorIncompetentType);
  } else if (props.key === 'isSpouseDeceased') {
    switch (props.value) {
      case 'Yes':
        updatePartyType(PARTY_TYPES.petitionerDeceasedSpouse);
        break;
      case 'No':
        updatePartyType(PARTY_TYPES.petitionerSpouse);
        store.set(state.modal.showModal, 'SpousePermissionConfirmModal');
        break;
    }
  } else if (props.key === 'otherType') {
    store.set(state.form.otherType, props.value);

    switch (props.value) {
      case PARTY_TYPES.donor:
        updatePartyType(PARTY_TYPES.donor);
        break;
      case PARTY_TYPES.transferee:
        updatePartyType(PARTY_TYPES.transferee);
        break;
      case 'Deceased Spouse':
        updatePartyType(PARTY_TYPES.survivingSpouse);
        break;
      default:
        store.unset(state.form.partyType);
        break;
    }
  } else if (props.key === 'businessType') {
    updatePartyType(props.value);
  } else if (props.key === 'estateType') {
    store.set(state.form.otherType, 'An estate or trust');
    updatePartyType(props.value);
  } else if (props.key === 'minorIncompetentType') {
    store.set(state.form.otherType, 'A minor or legally incompetent person');
    updatePartyType(props.value);
  }
};
