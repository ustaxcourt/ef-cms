export const getClinicLetterKey = ({
  procedureType,
  trialLocation,
}: {
  procedureType: string;
  trialLocation: string;
}): string => {
  const formattedPreferredTrialCity = trialLocation
    .replace(',', '')
    .replace(/ /g, '-');

  const clinicLetterKey = `clinic-letter-${formattedPreferredTrialCity}-${procedureType}`;

  return clinicLetterKey.toLowerCase();
};
