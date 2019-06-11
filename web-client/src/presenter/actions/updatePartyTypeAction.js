import { state } from 'cerebral';

import { showContactsHelper } from '../computeds/showContactsHelper';

/**
 * updates the partyType, filingType, otherType, businessType,
 * contactPrimary, and/or contactSecondary depending on the
 * key/value pair passed in via props
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral store used for
 * getting props.key and props.value
 * @param {object} providers.get the cerebral get function used
 * for getting state.form.filingType
 * @returns {object} props
 */
export const updatePartyTypeAction = async ({ store, props, get }) => {
  let partyType = '';
  const { PARTY_TYPES, COUNTRY_TYPES } = get(state.constants);
  if (props.key === 'filingType') {
    if (props.value === 'Myself' || props.value === 'Individual petitioner') {
      partyType = PARTY_TYPES.petitioner;
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

  const showContacts = showContactsHelper(partyType, PARTY_TYPES);

  store.set(
    state.form.contactPrimary,
    (showContacts.contactPrimary && {
      countryType: COUNTRY_TYPES.DOMESTIC,
    }) ||
      {},
  );
  store.set(
    state.form.contactSecondary,
    (showContacts.contactSecondary && {
      countryType: COUNTRY_TYPES.DOMESTIC,
    }) ||
      {},
  );
};
