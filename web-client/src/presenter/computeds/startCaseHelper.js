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
    showOwnershipDisclosure:
      form.partyType === 'Partnership (as the tax matters partner)' ||
      form.partyType === 'Corporation',
    showOwnershipDisclosureValid: petition && petition.ownershipDisclosureFile,
    showRegularTrialCitiesHint: form.procedureType === 'Regular',
    showSelectTrial: !!form.procedureType,
    showSmallTrialCitiesHint: form.procedureType === 'Small',
    trialCities: form.trialCities || [],
    trialCitiesByState: states,

    showEstateFilingOptions: form.otherType === 'An estate or trust',
    showMinorIncompetentFilingOptions:
      form.otherType === 'A minor or incompetent person',

    showOtherFilingTypeOptions: form.filingType === 'Other',
    showBusinessFilingTypeOptions: form.filingType === 'A business',
    showPetitionerDeceasedSpouseForm:
      form.filingType === 'Myself and my spouse',

    showPetitionerContact: form.partyType === 'Petitioner',
    showPetitionerAndSpouseContact: form.partyType === 'Petitioner & Spouse',
    showPetitionerAndDeceasedSpouseContact:
      form.partyType === 'Petitioner & Deceased Spouse',

    showEstateWithExecutorContact:
      form.partyType ===
      'Estate with an Executor/Personal Representative/Fiduciary/etc.',
    showEstateWithoutExecutorContact:
      form.partyType ===
      'Estate without an Executor/Personal Representative/Fiduciary/etc.',
    showTrustAndTrusteeContact: form.partyType === 'Trust',

    showCorporationContact: form.partyType === 'Corporation',
    showPartnershipTaxMattersContact:
      form.partyType === 'Partnership (as the tax matters partner)',
    showPartnershipOtherContact:
      form.partyType ===
      'Partnership (as a partner other than tax matters partner)',
    showPartnershipBBAContact:
      form.partyType ===
      'Partnership (as a partnership representative under the BBA regime)',

    showConservatorContact: form.partyType === 'Conservator',
    showGuardianContact: form.partyType === 'Guardian',
    showCustodianContact: form.partyType === 'Custodian',
    showMinorContact:
      form.partyType ===
      'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
    showIncompetentPersonContact:
      form.partyType ===
      'Next Friend for an Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary)',

    showDonorContact: form.partyType === 'Donor',
    showTransfereeContact: form.partyType === 'Transferee',
    showSurvivingSpouseContact: form.partyType === 'Surviving Spouse',
  };
};
