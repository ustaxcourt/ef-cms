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
    showPetitionFileValid: petition.petitionFile,
    showRegularTrialCitiesHint: form.procedureType === 'Regular',
    showSelectTrial: !!form.procedureType,
    showSmallTrialCitiesHint: form.procedureType === 'Small',
    trialCities: form.trialCities || [],
    trialCitiesByState: states,
  };
};
