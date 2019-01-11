import { state } from 'cerebral';

export default get => {
  const form = get(state.form);
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
    showIrsNoticeFileValid: !!form, // TODO: derive from state
    showPetitionFileValid: !!form, // TODO: derive from state
    uploadsFinished: 0, // TODO: derive from state
    uploadPercentage: 0, // TODO: derive from state
    trialCitiesByState: states,
    trialCities: form.trialCities || [],
    irsNoticeDate:
      form.year && form.month && form.day
        ? `${form.year}-${form.month}-${form.day}`
        : null,
  };
};
