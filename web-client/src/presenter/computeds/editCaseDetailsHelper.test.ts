import {
  caseServicesSupervisorUser,
  docketClerkUser,
} from '@shared/test/mockUsers';
import { getUserPermissions } from '@web-client/authorization/getUserPermissions';
import { editCaseDetailsHelper } from '@web-client/presenter/computeds/editCaseDetailsHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('editCaseDetailsHelper', () => {
  it('returns canEditStjEligibility true if user is case service supervisor', () => {
    const result = runCompute(editCaseDetailsHelper, {
      state: {
        permissions: getUserPermissions(caseServicesSupervisorUser),
      },
    });

    expect(result.canEditStjEligibility).toBe(true);
  });

  it('returns canEditStjEligibility false if user is docket clerk', () => {
    const result = runCompute(editCaseDetailsHelper, {
      state: {
        permissions: getUserPermissions(docketClerkUser),
      },
    });

    expect(result.canEditStjEligibility).toBe(false);
  });
});
