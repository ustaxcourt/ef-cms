import { state } from 'cerebral';

export default get => {
  const form = get(state.form);
  const petition = get(state.petition);
  const trialCities = get(state.form.trialCities) || [];
  const getTrialCityName = get(state.getTrialCityName);
  const states = {};
  trialCities.forEach(
    trialCity =>
      (states[trialCity.state] = [
        ...(states[trialCity.state] || []),
        getTrialCityName(trialCity),
      ]),
  );

  return {
    showPetitionFileValid: petition && petition.petitionFile,
    showOwnershipDisclosure: form.partyType && form.filingType === 'A business',
    showOwnershipDisclosureValid: petition && petition.ownershipDisclosureFile,
    showRegularTrialCitiesHint: form.procedureType === 'Regular',
    showSelectTrial: !!form.procedureType,
    showSmallTrialCitiesHint: form.procedureType === 'Small',
    trialCities: form.trialCities || [],
    trialCitiesByState: states,

    showEstateFilingOptions: form.otherType === 'An estate or trust',
    showMinorIncompetentFilingOptions:
      form.otherType === 'A minor or legally incompetent person',

    showOtherFilingTypeOptions: form.filingType === 'Other',
    showBusinessFilingTypeOptions: form.filingType === 'A business',
    showPetitionerDeceasedSpouseForm:
      form.filingType === 'Myself and my spouse',

    showPrimaryContact:
      form.partyType === 'Petitioner' ||
      form.partyType === 'Petitioner & Spouse' ||
      form.partyType === 'Petitioner & Deceased Spouse' ||
      form.partyType ===
        'Estate with an Executor/Personal Representative/Fiduciary/etc.' ||
      form.partyType ===
        'Estate without an Executor/Personal Representative/Fiduciary/etc.' ||
      form.partyType === 'Trust' ||
      form.partyType === 'Corporation' ||
      form.partyType === 'Partnership (as the tax matters partner)' ||
      form.partyType ===
        'Partnership (as a partner other than tax matters partner)' ||
      form.partyType ===
        'Partnership (as a partnership representative under the BBA regime)' ||
      form.partyType === 'Conservator' ||
      form.partyType === 'Guardian' ||
      form.partyType === 'Custodian' ||
      form.partyType ===
        'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)' ||
      form.partyType ===
        'Next Friend for a Legally Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary)' ||
      form.partyType === 'Donor' ||
      form.partyType === 'Transferee' ||
      form.partyType === 'Surviving Spouse',

    showSecondaryContact:
      form.partyType === 'Petitioner & Spouse' ||
      form.partyType === 'Petitioner & Deceased Spouse' ||
      form.partyType ===
        'Estate with an Executor/Personal Representative/Fiduciary/etc.' ||
      form.partyType === 'Trust' ||
      form.partyType === 'Partnership (as the tax matters partner)' ||
      form.partyType ===
        'Partnership (as a partner other than tax matters partner)' ||
      form.partyType ===
        'Partnership (as a partnership representative under the BBA regime)' ||
      form.partyType === 'Conservator' ||
      form.partyType === 'Guardian' ||
      form.partyType === 'Custodian' ||
      form.partyType ===
        'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)' ||
      form.partyType ===
        'Next Friend for a Legally Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary)' ||
      form.partyType === 'Surviving Spouse',

    showHasIrsNoticeOptions: form.hasIrsNotice === true,
    showNotHasIrsNoticeOptions: form.hasIrsNotice === false,
  };
};
