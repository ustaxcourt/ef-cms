import { showContactsHelper } from './showContactsHelper';
import { state } from 'cerebral';

export const startCaseHelper = (get, applicationContext) => {
  const { CASE_TYPES_MAP, FILING_TYPES, PARTY_TYPES, USER_ROLES } =
    applicationContext.getConstants();
  const form = get(state.form);
  const user = applicationContext.getCurrentUser();

  const showContacts = showContactsHelper(form.partyType, PARTY_TYPES);

  let contactPrimaryLabel = 'Contact Information';
  let contactSecondaryLabel = 'Contact Information';

  if (
    [
      PARTY_TYPES.petitioner,
      PARTY_TYPES.petitionerDeceasedSpouse,
      PARTY_TYPES.petitionerSpouse,
    ].includes(form.partyType)
  ) {
    contactPrimaryLabel = 'Your contact information';
  }

  if (
    [
      PARTY_TYPES.petitionerDeceasedSpouse,
      PARTY_TYPES.petitionerSpouse,
    ].includes(form.partyType)
  ) {
    contactSecondaryLabel = 'Spouse’s contact information';
  }

  const hasContactSecondary =
    form.contactSecondary && form.contactSecondary.name;

  const caseCaption =
    applicationContext.getUtilities().getCaseCaption(form) || '';
  const caseTitle = applicationContext.getCaseTitle(caseCaption);

  const formattedCaseType = ['Disclosure1', 'Disclosure2'].includes(
    form.caseType,
  )
    ? CASE_TYPES_MAP.disclosure
    : form.caseType;

  return {
    caseTitle,
    contactPrimaryLabel,
    contactSecondaryLabel,
    deceasedSpouseLegend:
      user.role === USER_ROLES.petitioner
        ? 'Is your spouse deceased?'
        : 'Is the spouse deceased?',
    filingTypes: FILING_TYPES[user.role] || FILING_TYPES[USER_ROLES.petitioner],
    formattedCaseType,
    hasContactSecondary,
    minorIncompetentLegend:
      user.role === USER_ROLES.petitioner
        ? 'What is your role in filing for this minor or legally incompetent person?'
        : 'What is the petitioner’s role in filing for this minor or incompetent person?',
    noticeLegend:
      user.role === USER_ROLES.petitioner
        ? 'Did you receive a notice from the IRS?'
        : 'Do you have a notice from the IRS?',
    showBusinessFilingTypeOptions: form.filingType === 'A business',
    showEstateFilingOptions: form.otherType === 'An estate or trust',
    showHasIrsNoticeOptions: form.hasIrsNotice === true,
    showMinorIncompetentFilingOptions:
      form.otherType === 'A minor or legally incompetent person',
    showNotHasIrsNoticeOptions: form.hasIrsNotice === false,
    showOtherFilingTypeOptions: form.filingType === CASE_TYPES_MAP.other,
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
