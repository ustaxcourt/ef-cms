import { state } from 'cerebral';

export const practitionerDetailHelper = (get, applicationContext) => {
  const practitionerDetail = get(state.practitionerDetail);
  return {
    ...practitionerDetail,
    additionalPhone: practitionerDetail.additionalPhone || 'Not provided',
    admissionsDateFormatted: applicationContext
      .getUtilities()
      .formatDateString(practitionerDetail.admissionsDate, 'MM/DD/YYYY'),
    alternateEmail: practitionerDetail.alternateEmail || 'Not provided',
  };
};
