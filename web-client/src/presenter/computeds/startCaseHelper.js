import { state } from 'cerebral';

export default get => {
  const form = get(state.form);
  const trialCities = get(state.form.trialCities) || [];

  const states = {};
  trialCities.forEach(
    trialCity =>
      (states[trialCity.state] = [
        ...(states[trialCity.state] || []),
        trialCity,
      ]),
  );

  return {
    showIrsNoticeFileValid: !!form, // TODO: derive from state
    showPetitionFileValid: !!form, // TODO: derive from state
    uploadsFinished: 0, // TODO: derive from state
    uploadPercentage: 0, // TODO: derive from state
    trialCitiesByState: states,
    trialCities: form.trialCities || [],
    showRegularTrialCitiesHint: form.procedureType == 'Regular',
    showSmallTrialCitiesHint: form.procedureType === 'Small',
  };
};
