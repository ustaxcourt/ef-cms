import { User } from '../../../../shared/src/business/entities/User';
import { docketRecordHelper } from './docketRecordHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';

const getBaseState = user => {
  return {
    permissions: getUserPermissions(user),
  };
};

describe('docket record helper', () => {
  it('should show direct download link and not document detail link if the user does not have UPDATE_CASE permission', () => {
    const user = {
      role: User.ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(docketRecordHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        form: {},
      },
    });
    expect(result.showDirectDownloadLink).toEqual(true);
    expect(result.showDocumentDetailLink).toEqual(false);
  });

  it('should show document detail link and not direct download link if the user does have UPDATE_CASE permission', () => {
    const user = {
      role: User.ROLES.petitionsClerk,
      userId: '789',
    };
    const result = runCompute(docketRecordHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        form: {},
      },
    });
    expect(result.showDocumentDetailLink).toEqual(true);
    expect(result.showDirectDownloadLink).toEqual(false);
  });
});
