import { state } from 'cerebral';

import { PARTY_TYPES } from '../../../../shared/src/business/entities/Contacts/PetitionContact';

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

  const hasPrimaryContact =
    partyType === PARTY_TYPES.petitioner ||
    partyType === PARTY_TYPES.petitionerSpouse ||
    partyType === PARTY_TYPES.petitionerDeceasedSpouse ||
    partyType === PARTY_TYPES.estate ||
    partyType === PARTY_TYPES.estateWithoutExecutor ||
    partyType === PARTY_TYPES.trust ||
    partyType === PARTY_TYPES.corporation ||
    partyType === PARTY_TYPES.partnershipAsTaxMattersPartner ||
    partyType === PARTY_TYPES.partnershipOtherThanTaxMatters ||
    partyType === PARTY_TYPES.partnershipBBA ||
    partyType === PARTY_TYPES.conservator ||
    partyType === PARTY_TYPES.guardian ||
    partyType === PARTY_TYPES.custodian ||
    partyType === PARTY_TYPES.nextFriendForMinor ||
    partyType === PARTY_TYPES.nextFriendForIncomponentPerson ||
    partyType === PARTY_TYPES.donor ||
    partyType === PARTY_TYPES.transferee ||
    partyType === PARTY_TYPES.survivingSpouse;

  const hasSecondaryContact =
    partyType === PARTY_TYPES.petitionerSpouse ||
    partyType === PARTY_TYPES.petitionerDeceasedSpouse ||
    partyType === PARTY_TYPES.estate ||
    partyType === PARTY_TYPES.trust ||
    partyType === PARTY_TYPES.partnershipAsTaxMattersPartner ||
    partyType === PARTY_TYPES.partnershipOtherThanTaxMatters ||
    partyType === PARTY_TYPES.partnershipBBA ||
    partyType === PARTY_TYPES.conservator ||
    partyType === PARTY_TYPES.guardian ||
    partyType === PARTY_TYPES.custodian ||
    partyType === PARTY_TYPES.nextFriendForMinor ||
    partyType === PARTY_TYPES.nextFriendForIncomponentPerson ||
    partyType === PARTY_TYPES.survivingSpouse;

  store.set(
    state.form.contactPrimary,
    (hasPrimaryContact && {
      countryType: 'domestic',
    }) ||
      {},
  );
  store.set(
    state.form.contactSecondary,
    (hasSecondaryContact && {
      countryType: 'domestic',
    }) ||
      {},
  );
};
