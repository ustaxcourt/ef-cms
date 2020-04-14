import { state } from 'cerebral';

export const practitionerDetailHelper = (get, applicationContext) => {
  const practitionerDetail = get(state.practitionerDetail);
  const permissions = get(state.permissions);

  return {
    ...practitionerDetail,
    additionalPhone: practitionerDetail.additionalPhone || 'Not provided',
    admissionsDateFormatted: applicationContext
      .getUtilities()
      .formatDateString(practitionerDetail.admissionsDate, 'MM/DD/YYYY'),
    alternateEmail: practitionerDetail.alternateEmail || 'Not provided',
    firmNameFormatted: practitionerDetail.firmName || 'None',
    showEditLink: permissions.ADD_EDIT_PRACTITIONER_USER,
  };
};
