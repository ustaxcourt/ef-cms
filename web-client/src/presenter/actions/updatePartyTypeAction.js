import { state } from 'cerebral';

export default async ({ store, props }) => {
  let partyType;
  if (props.key === 'filingType') {
    switch (props.value) {
      case 'Myself':
        partyType = 'Petitioner';
        break;
    }
  }

  store.set(state.form.partyType, partyType);
};
