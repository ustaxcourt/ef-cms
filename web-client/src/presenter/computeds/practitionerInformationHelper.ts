/* eslint-disable complexity */

import { state } from '@web-client/presenter/app.cerebral';

import { Get } from '../../utilities/cerebralWrapper';
export const practitionerInformationHelper = (get: Get): any => {
  const permissions = get(state.permissions);

  return {
    showDocumentationTab: permissions.UPLOAD_PRACTITIONER_DOCUMENT,
  };
};
