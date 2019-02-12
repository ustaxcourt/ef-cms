import { state } from 'cerebral';

export default async ({ store, props }) => {
  if (props.key === 'filingType') {
    switch (props.value) {
      case 'Myself':
        store.set(state.form.partyType, 'Petitioner');
        break;
      default:
        store.set(state.form.partyType, null);
    }
  } else if (props.key === 'isSpouseDeceased') {
    switch (props.value) {
      case 'Yes':
        store.set(state.form.partyType, 'Petitioner & Deceased Spouse');
        store.set(state.form.contactSecondary, {});
        break;
      case 'No':
        store.set(state.form.partyType, 'Petitioner & Spouse');
        store.set(state.form.contactSecondary, {});
        break;
      default:
        store.set(state.form.partyType, null);
    }
  } else {
    store.set(state.form.partyType, null);
  }
};
