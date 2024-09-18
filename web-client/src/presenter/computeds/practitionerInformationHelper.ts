/* eslint-disable complexity */

import { ClientApplicationContext } from '@web-client/applicationContext';
import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';
export const practitionerInformationHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const permissions = get(state.permissions);
  const practitionerDetail = get(state.practitionerDetail);

  const user = get(state.user);
  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  console.log('practitionerDetail', practitionerDetail);

  return {
    closedCases: practitionerDetail.closedCases,
    openCases: practitionerDetail.openCases,
    showDocumentationTab: permissions.UPLOAD_PRACTITIONER_DOCUMENT,
    showPrintCaseListLink: isInternalUser,
    userId: practitionerDetail.userId,
  };
};
