import { state } from 'cerebral';
import { showContactsHelper } from './showContactsHelper';

export const startCaseHelper = get => {
  const { PARTY_TYPES } = get(state.constants);

  const form = get(state.form);
  const petition = get(state.petition);

  const showContacts = showContactsHelper(form.partyType, PARTY_TYPES);

  return {
    showBusinessFilingTypeOptions: form.filingType === 'A business',
    showEstateFilingOptions: form.otherType === 'An estate or trust',
    showHasIrsNoticeOptions: form.hasIrsNotice === true,
    showMinorIncompetentFilingOptions:
      form.otherType === 'A minor or legally incompetent person',
    showNotHasIrsNoticeOptions: form.hasIrsNotice === false,
    showOtherFilingTypeOptions: form.filingType === 'Other',

    showOwnershipDisclosure: form.partyType && form.filingType === 'A business',
    showOwnershipDisclosureValid: petition && petition.ownershipDisclosureFile,

    showPetitionerDeceasedSpouseForm:
      form.filingType === 'Myself and my spouse',
    showPetitionFileValid: petition && petition.petitionFile,
    showPrimaryContact: showContacts.contactPrimary,
    showRegularTrialCitiesHint: form.procedureType === 'Regular',
    showSecondaryContact: showContacts.contactSecondary,

    showSelectTrial: !!form.procedureType,
    showSmallTrialCitiesHint: form.procedureType === 'Small',

    showStinFileValid: petition && petition.stinFile,
  };
};
