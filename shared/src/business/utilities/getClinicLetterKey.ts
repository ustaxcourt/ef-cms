/**
 * Formats the clinic letter key used to store the clinic letters for each location and procedureType combination in s3
 *
 * @param {string} procedureType type of procedure for case
 * @param {string} trialLocation location of trial for case
 * @returns {string} formatted clinic letter key
 */
export const getClinicLetterKey = ({ procedureType, trialLocation }) => {
  const formattedPreferredTrialCity = trialLocation
    .replace(',', '')
    .replace(/ /g, '-');

  const clinicLetterKey = `clinic-letter-${formattedPreferredTrialCity}-${procedureType}`;

  return clinicLetterKey.toLowerCase();
};
