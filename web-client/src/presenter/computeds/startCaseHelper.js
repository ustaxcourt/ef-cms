import { state } from 'cerebral';
import { showContactsHelper } from '../helpers/showContactsHelper';

export default get => {
  const { PARTY_TYPES, TRIAL_CITIES } = get(state.constants);

  const form = get(state.form);
  const petition = get(state.petition);
  const procedureType = get(state.form.procedureType);
  const trialCities =
    procedureType === 'Small' ? TRIAL_CITIES.SMALL : TRIAL_CITIES.REGULAR;
  const getTrialCityName = get(state.getTrialCityName);
  const states = {};
  trialCities.forEach(
    trialCity =>
      (states[trialCity.state] = [
        ...(states[trialCity.state] || []),
        getTrialCityName(trialCity),
      ]),
  );

  const showContacts = showContactsHelper(form.partyType, PARTY_TYPES);

  return {
    showPetitionFileValid: petition && petition.petitionFile,
    showOwnershipDisclosure: form.partyType && form.filingType === 'A business',
    showOwnershipDisclosureValid: petition && petition.ownershipDisclosureFile,
    showRegularTrialCitiesHint: form.procedureType === 'Regular',
    showSelectTrial: !!form.procedureType,
    showSmallTrialCitiesHint: form.procedureType === 'Small',
    trialCitiesByState: states,

    showEstateFilingOptions: form.otherType === 'An estate or trust',
    showMinorIncompetentFilingOptions:
      form.otherType === 'A minor or legally incompetent person',

    showOtherFilingTypeOptions: form.filingType === 'Other',
    showBusinessFilingTypeOptions: form.filingType === 'A business',
    showPetitionerDeceasedSpouseForm:
      form.filingType === 'Myself and my spouse',

    showPrimaryContact: showContacts.contactPrimary,
    showSecondaryContact: showContacts.contactSecondary,

    showHasIrsNoticeOptions: form.hasIrsNotice === true,
    showNotHasIrsNoticeOptions: form.hasIrsNotice === false,
  };
};
