import { showContactsHelper } from './showContactsHelper';
import { state } from 'cerebral';

export const startCaseHelper = get => {
  const { PARTY_TYPES } = get(state.constants);

  const form = get(state.form);
  const userRole = get(state.user.role);

  const showContacts = showContactsHelper(form.partyType, PARTY_TYPES);

  let contactPrimaryLabel = 'Contact Information';
  let contactSecondaryLabel = 'Contact Information';

  if (
    form.partyType === 'Petitioner' ||
    form.partyType === 'Petitioner & Spouse'
  ) {
    contactPrimaryLabel = 'Your Contact Information';
  }

  if (form.partyType === 'Petitioner & Spouse') {
    contactSecondaryLabel = 'Spouse‘s Contact Information';
  }

  return {
    contactPrimaryLabel,
    contactSecondaryLabel,
    deceasedSpouseLegend:
      userRole === 'petitioner'
        ? 'Is your spouse deceased?'
        : 'Is the spouse deceased?',
    hasContactSecondary:
      form.contactSecondary && Object.keys(form.contactSecondary).length > 0,
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
    showOwnershipDisclosureValid: form.ownershipDisclosureFile,

    showPetitionFileValid: form.petitionFile,
    showPetitionerDeceasedSpouseForm:
      form.filingType === 'Myself and my spouse' ||
      form.filingType === 'Petitioner and spouse',
    showPrimaryContact: showContacts.contactPrimary,
    showRegularTrialCitiesHint: form.procedureType === 'Regular',
    showSecondaryContact: showContacts.contactSecondary,

    showSelectTrial: !!form.procedureType,
    showSmallTrialCitiesHint: form.procedureType === 'Small',

    showStinFileValid: form.stinFile,
  };
};
