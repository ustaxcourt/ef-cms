import { state } from 'cerebral';

import { PARTY_TYPES } from '../../../../shared/src/business/entities/Contacts/PetitionContact';
import { showContactsHelper } from '../helpers/showContactsHelper';

export const updatePartyTypeAction = async ({ store, props, get }) => {
  let partyType = '';
  if (props.key === 'filingType') {
    switch (props.value) {
      case 'Myself':
        partyType = PARTY_TYPES.petitioner;
        break;
    }
  } else if (props.key === 'isSpouseDeceased') {
    switch (props.value) {
      case 'Yes':
        partyType = PARTY_TYPES.petitionerDeceasedSpouse;
        break;
      case 'No':
        partyType = PARTY_TYPES.petitionerSpouse;
        break;
    }
  } else if (props.key === 'otherType') {
    store.set(state.form.otherType, props.value);

    switch (props.value) {
      case 'Donor':
        partyType = PARTY_TYPES.donor;
        break;
      case 'Transferee':
        partyType = PARTY_TYPES.transferee;
        break;
      case 'Deceased Spouse':
        partyType = PARTY_TYPES.survivingSpouse;
        break;
    }
  } else if (props.key === 'businessType') {
    partyType = props.value;
  } else if (props.key === 'estateType') {
    store.set(state.form.otherType, 'An estate or trust');
    partyType = props.value;
  } else if (props.key === 'minorIncompetentType') {
    store.set(state.form.otherType, 'A minor or legally incompetent person');
    partyType = props.value;
  }
  store.set(state.form.partyType, partyType);
  if (get(state.form.filingType) !== 'A business') {
    // clear the ownership disclosure file and business type
    store.set(state.petition.ownershipDisclosureFile, undefined);
    store.set(state.form.businessType, undefined);
  }

  const showContacts = showContactsHelper(partyType);

  store.set(
    state.form.contactPrimary,
    (showContacts.contactPrimary && {
      countryType: 'domestic',
    }) ||
      {},
  );
  store.set(
    state.form.contactSecondary,
    (showContacts.contactSecondary && {
      countryType: 'domestic',
    }) ||
      {},
  );
};
