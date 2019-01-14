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

  let numberOfUploadFiles = 1;
  if (petition.irsNoticeFile) {
    numberOfUploadFiles = 2;
  }

  return {
    showIrsNoticeFileValid: petition.irsNoticeFile,
    showPetitionFileValid: petition.petitionFile,
    uploadsRemaining: numberOfUploadFiles - petition.uploadsFinished,
    uploadPercentage: (petition.uploadsFinished * 100) / numberOfUploadFiles,
    trialCitiesByState: states,
    trialCities: form.trialCities || [],
    showSelectTrial: !!form.procedureType,
    showRegularTrialCitiesHint: form.procedureType === 'Regular',
    showSmallTrialCitiesHint: form.procedureType === 'Small',
    numberOfUploadFiles: numberOfUploadFiles,
  };
};
