import { showContactsHelper } from './showContactsHelper';
import { state } from 'cerebral';

export const startCaseHelper = get => {
  const { PARTY_TYPES } = get(state.constants);

  const form = get(state.form);
  const petition = get(state.petition);
  const userRole = get(state.user.role);

  const showContacts = showContactsHelper(form.partyType, PARTY_TYPES);

  return {
    deceasedSpouseLegend:
      userRole === 'petitioner'
        ? 'Is your spouse deceased?'
        : 'Is the spouse deceased?',
    minorIncompetentLegend:
      userRole === 'petitioner'
        ? 'What is your role in filing for this minor or legally incompetent person?'
        : "What is the petitioner's role in filing for this minor or incompetent person?",
    noticeLegend:
      userRole === 'petitioner'
        ? 'Did you receive a Notice from the IRS?'
        : 'Do you have a Notice from the IRS?',

    showBusinessFilingTypeOptions: form.filingType === 'A business',
    showEstateFilingOptions: form.otherType === 'An estate or trust',
    showHasIrsNoticeOptions: form.hasIrsNotice === true,
    showMinorIncompetentFilingOptions:
      form.otherType === 'A minor or legally incompetent person',
    showNotHasIrsNoticeOptions: form.hasIrsNotice === false,
    showOtherFilingTypeOptions: form.filingType === 'Other',

    showOwnershipDisclosure: form.partyType && form.filingType === 'A business',
    showOwnershipDisclosureValid: petition && petition.ownershipDisclosureFile,

    showPetitionFileValid: petition && petition.petitionFile,
    showPetitionerDeceasedSpouseForm:
      form.filingType === 'Myself and my spouse' ||
      form.filingType === 'Petitioner and spouse',
    showPrimaryContact: showContacts.contactPrimary,
    showRegularTrialCitiesHint: form.procedureType === 'Regular',
    showSecondaryContact: showContacts.contactSecondary,

    showSelectTrial: !!form.procedureType,
    showSmallTrialCitiesHint: form.procedureType === 'Small',

    showStinFileValid: petition && petition.stinFile,
  };
};
