import { state } from 'cerebral';

export const practitionerDetailHelper = (get, applicationContext) => {
  const practitionerDetail = get(state.practitionerDetail);
  return {
    ...practitionerDetail,
    admissionsDateFormatted: applicationContext
      .getUtilities()
      .formatDateString(practitionerDetail.admissionsDate, 'MM/DD/YYYY'),
  };
};
