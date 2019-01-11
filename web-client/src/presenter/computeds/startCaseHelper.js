import { state } from 'cerebral';

export default get => {
  const form = get(state.form);

  return {
    showIrsNoticeFileValid: !!form, // TODO: derive from state
    showPetitionFileValid: !!form, // TODO: derive from state
    uploadsFinished: 0, // TODO: derive from state
    uploadPercentage: 0, // TODO: derive from state
    trialCities: form.trialCities || [],
  };
};
