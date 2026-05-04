export const getClinicLetterKey = ({
  procedureType,
  trialLocation,
}: {
  procedureType: string;
  trialLocation: any;
}): string => {
  const formattedPreferredTrialCity = trialLocation
    .replace(',', '')
    .replace(/ /g, '-');

  const clinicLetterKey = `clinic-letter-${formattedPreferredTrialCity}-${procedureType}`;

  return clinicLetterKey.toLowerCase();
};
