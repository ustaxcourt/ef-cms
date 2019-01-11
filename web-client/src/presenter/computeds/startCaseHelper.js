import { state } from 'cerebral';

export default get => {
  const form = get(state.form);
  const trialCities = get(state.trialCities);

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
    irsNoticeDate:
      form.year && form.month && form.day
        ? `${form.year}-${form.month}-${form.day}`
        : null,
  };
};
