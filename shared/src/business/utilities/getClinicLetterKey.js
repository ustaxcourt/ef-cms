/**
 * Formats the clinic letter key for used to store the clinic letters for each location and procedureType combination in s3
 *
 * @param {string} procedureType type of procedure for case
 * @param {string} trialLocation location of trial for case
 * @returns {string} formatted clinic letter key
 */
exports.getClinicLetterKey = ({ procedureType, trialLocation }) => {
  const formattedPreferredTrialCity = trialLocation
    .replace(',', '')
    .replace(/ /g, '-');

  const clinicLetterKey = `${formattedPreferredTrialCity}-${procedureType}`;

  return clinicLetterKey;
};
