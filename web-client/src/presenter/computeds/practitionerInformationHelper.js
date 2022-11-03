/* eslint-disable complexity */
import { state } from 'cerebral';

export const practitionerInformationHelper = get => {
  const permissions = get(state.permissions);

  return {
    showDocumentationTab: permissions.UPLOAD_PRACTITIONER_DOCUMENT,
  };
};
