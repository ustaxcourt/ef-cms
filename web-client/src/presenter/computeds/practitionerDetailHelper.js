import { state } from 'cerebral';

export const practitionerDetailHelper = (get, applicationContext) => {
  const practitionerDetail = get(state.practitionerDetail);
  const permissions = get(state.permissions);
  const user = get(state.user);
  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  const pendingEmailFormatted = practitionerDetail.pendingEmail
    ? `${practitionerDetail.pendingEmail} (Pending)`
    : null;

  let emailFormatted;

  if (
    practitionerDetail.email &&
    pendingEmailFormatted !== practitionerDetail.email
  ) {
    emailFormatted = practitionerDetail.email;
  } else {
    emailFormatted = pendingEmailFormatted ? undefined : 'Not provided';
  }

  return {
    ...practitionerDetail,
    additionalPhone: practitionerDetail.additionalPhone || 'Not provided',
    admissionsDateFormatted: applicationContext
      .getUtilities()
      .formatDateString(practitionerDetail.admissionsDate, 'MM/DD/YYYY'),
    emailFormatted,
    firmNameFormatted: practitionerDetail.firmName || 'None',
    pendingEmailFormatted,
    showEAccessFlag: isInternalUser && practitionerDetail.hasEAccess,
    showEditLink: permissions.ADD_EDIT_PRACTITIONER_USER,
    showPrintCaseListLink: isInternalUser,
  };
};
