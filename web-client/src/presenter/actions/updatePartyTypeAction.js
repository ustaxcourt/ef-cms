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
    switch (props.value) {
      case 'Corporation':
        partyType = 'Corporation';
        break;
      case 'Partnership (as the tax matters partner)':
        partyType = 'Partnership (as the tax matters partner)';
        break;
      case 'Partnership (as a partner other than tax matters partner)':
        partyType = 'Partnership (as a partner other than tax matters partner)';
        break;
      case 'Partnership (as a partnership representative under the BBA regime)':
        partyType =
          'Partnership (as a partnership representative under the BBA regime)';
        break;
    }
  } else if (props.key === 'estateType') {
    store.set(state.form.otherType, 'An estate or trust');

    switch (props.value) {
      case 'Estate with an Executor/Personal Representative/Fiduciary/etc.':
        partyType =
          'Estate with an Executor/Personal Representative/Fiduciary/etc.';
        break;
      case 'Estate without an Executor/Personal Representative/Fiduciary/etc.':
        partyType =
          'Estate without an Executor/Personal Representative/Fiduciary/etc.';
        break;
      case 'Trust':
        partyType = 'Trust';
        break;
    }
  } else if (props.key === 'minorIncompetentType') {
    store.set(state.form.otherType, 'A minor or legally incompetent person');

    switch (props.value) {
      case 'Conservator':
        partyType = 'Conservator';
        break;
      case 'Guardian':
        partyType = 'Guardian';
        break;
      case 'Custodian':
        partyType = 'Custodian';
        break;
      case 'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)':
        partyType =
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)';
        break;
      case 'Next Friend for a Legally Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary)':
        partyType =
          'Next Friend for a Legally Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary)';
        break;
    }
  }
  store.set(state.form.partyType, partyType);
  if (get(state.form.filingType) !== 'A business') {
    //clear the ownership disclosure file and business type
    store.set(state.petition.ownershipDisclosureFile, undefined);
    store.set(state.form.businessType, undefined);
  }
  // ask UI
  store.set(state.form.contactPrimary, {});
  store.set(state.form.contactSecondary, {});
};
