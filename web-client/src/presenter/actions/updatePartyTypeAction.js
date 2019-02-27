import { state } from 'cerebral';

export default async ({ store, props, get }) => {
  let partyType = '';
  if (props.key === 'filingType') {
    switch (props.value) {
      case 'Myself':
        partyType = 'Petitioner';
        break;
    }
  } else if (props.key === 'isSpouseDeceased') {
    switch (props.value) {
      case 'Yes':
        partyType = 'Petitioner & Deceased Spouse';
        break;
      case 'No':
        partyType = 'Petitioner & Spouse';
        break;
    }
  } else if (props.key === 'otherType') {
    store.set(state.form.otherType, props.value);

    switch (props.value) {
      case 'Donor':
        partyType = 'Donor';
        break;
      case 'Transferee':
        partyType = 'Transferee';
        break;
      case 'Deceased Spouse':
        partyType = 'Surviving Spouse';
        break;
    }
  } else if (props.key === 'businessType') {
    partyType = props.value;
  } else if (props.key === 'estateType') {
    store.set(state.form.otherType, 'An estate or trust');
    partyType = props.value;
  } else if (props.key === 'minorIncompetentType') {
    store.set(state.form.otherType, 'A minor or incompetent person');
    partyType = props.value;
  }
  store.set(state.form.partyType, partyType);
  if (get(state.form.filingType) !== 'A business') {
    // clear the ownership disclosure file and business type
    store.set(state.petition.ownershipDisclosureFile, undefined);
    store.set(state.form.businessType, undefined);
  }
  // ask UI
  store.set(state.form.contactPrimary, {});
  store.set(state.form.contactSecondary, {});
};
