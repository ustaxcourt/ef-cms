import { state } from '@web-client/presenter/app.cerebral';
import { Get } from 'node_modules/cerebral';

export type EditCaseDetailsHelper = {
  canEditStjEligibility: boolean;
};

export const editCaseDetailsHelper = (get: Get): EditCaseDetailsHelper => {
  const permissions = get(state.permissions);

  return {
    canEditStjEligibility: !!permissions.EDIT_STJ_ELIGIBILITY,
  };
};
