import { state } from 'cerebral';

export const practitionerDetailHelper = (get, applicationContext) => {
  const practitionerDetail = get(state.practitionerDetail);
  const permissions = get(state.permissions);
  const user = get(state.user);
  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  return {
    ...practitionerDetail,
    additionalPhone: practitionerDetail.additionalPhone || 'Not provided',
    admissionsDateFormatted: applicationContext
      .getUtilities()
      .formatDateString(practitionerDetail.admissionsDate, 'MM/DD/YYYY'),
    alternateEmail: practitionerDetail.alternateEmail || 'Not provided',
    firmNameFormatted: practitionerDetail.firmName || 'None',
    showEAccessFlag: isInternalUser && practitionerDetail.hasEAccess,
    showEditLink: permissions.ADD_EDIT_PRACTITIONER_USER,
  };
};
