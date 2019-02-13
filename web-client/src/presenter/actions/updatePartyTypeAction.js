import { state } from 'cerebral';

export default async ({ store, props }) => {
  let partyType = '';
  if (props.key === 'filingType') {
    switch (props.value) {
      case 'Myself':
        partyType = 'Petitioner';
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
  }
  store.set(state.form.partyType, partyType);
  // ask UI
  store.set(state.form.contactPrimary, {});
  store.set(state.form.contactSecondary, {});
};
