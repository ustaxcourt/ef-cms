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

  let numUploadFiles = 1;
  if (petition.irsNoticeFile) {
    numUploadFiles = 2;
  }

  return {
    showIrsNoticeFileValid: petition.irsNoticeFile,
    showPetitionFileValid: petition.petitionFile,
    uploadsFinished: numUploadFiles - petition.uploadsFinished,
    uploadPercentage: (petition.uploadsFinished * 100) / 2,
    trialCitiesByState: states,
    trialCities: form.trialCities || [],
    showRegularTrialCitiesHint: form.procedureType === 'Regular',
    showSmallTrialCitiesHint: form.procedureType === 'Small',
  };
};
