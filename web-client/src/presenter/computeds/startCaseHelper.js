import { state } from 'cerebral';
import { PARTY_TYPES } from '../../../../shared/src/business/entities/Contacts/PetitionContact';

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
      form.partyType === PARTY_TYPES.petitioner ||
      form.partyType === PARTY_TYPES.petitionerSpouse ||
      form.partyType === PARTY_TYPES.petitionerDeceasedSpouse ||
      form.partyType === PARTY_TYPES.estate ||
      form.partyType === PARTY_TYPES.estateWithoutExecutor ||
      form.partyType === PARTY_TYPES.trust ||
      form.partyType === PARTY_TYPES.corporation ||
      form.partyType === PARTY_TYPES.partnershipAsTaxMattersPartner ||
      form.partyType === PARTY_TYPES.partnershipOtherThanTaxMatters ||
      form.partyType === PARTY_TYPES.partnershipBBA ||
      form.partyType === PARTY_TYPES.conservator ||
      form.partyType === PARTY_TYPES.guardian ||
      form.partyType === PARTY_TYPES.custodian ||
      form.partyType === PARTY_TYPES.nextFriendForMinor ||
      form.partyType === PARTY_TYPES.nextFriendForIncompetentPerson ||
      form.partyType === PARTY_TYPES.donor ||
      form.partyType === PARTY_TYPES.transferee ||
      form.partyType === PARTY_TYPES.survivingSpouse,

    showSecondaryContact:
      form.partyType === PARTY_TYPES.petitionerSpouse ||
      form.partyType === PARTY_TYPES.petitionerDeceasedSpouse ||
      form.partyType === PARTY_TYPES.estate ||
      form.partyType === PARTY_TYPES.trust ||
      form.partyType === PARTY_TYPES.partnershipAsTaxMattersPartner ||
      form.partyType === PARTY_TYPES.partnershipOtherThanTaxMatters ||
      form.partyType === PARTY_TYPES.partnershipBBA ||
      form.partyType === PARTY_TYPES.conservator ||
      form.partyType === PARTY_TYPES.guardian ||
      form.partyType === PARTY_TYPES.custodian ||
      form.partyType === PARTY_TYPES.nextFriendForMinor ||
      form.partyType === PARTY_TYPES.nextFriendForIncompetentPerson ||
      form.partyType === PARTY_TYPES.survivingSpouse,

    showHasIrsNoticeOptions: form.hasIrsNotice === true,
    showNotHasIrsNoticeOptions: form.hasIrsNotice === false,
  };
};
