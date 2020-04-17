import { User } from '../../../../shared/src/business/entities/User';
import { caseInformationHelper } from './caseInformationHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';

const getBaseState = user => {
  return {
    permissions: getUserPermissions(user),
  };
};

describe('case information helper', () => {
  it('should show add counsel section if user is an internal user', () => {
    const user = {
      role: User.ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        form: {},
      },
    });
    expect(result.showAddCounsel).toEqual(true);
  });

  it('should not show add counsel section if user is an external user', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        form: {},
      },
    });
    expect(result.showAddCounsel).toEqual(false);
  });

  it('should show edit privatePractitioners and irsPractitioners buttons if user is an internal user and there are privatePractitioners and irsPractitioners on the case', () => {
    const user = {
      role: User.ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          irsPractitioners: [{ userId: '2' }],
          privatePractitioners: [{ userId: '1' }],
        },
        form: {},
      },
    });
    expect(result.showEditPrivatePractitioners).toBeTruthy();
    expect(result.showEditIrsPractitioners).toBeTruthy();
  });

  it('should not show edit privatePractitioners or irsPractitioners buttons if user is an internal user and there are not privatePractitioners and irsPractitioners on the case', () => {
    const user = {
      role: User.ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        form: {},
      },
    });
    expect(result.showEditPrivatePractitioners).toBeFalsy();
    expect(result.showEditIrsPractitioners).toBeFalsy();
  });

  it('should not show edit privatePractitioners or irsPractitioners buttons if user is not an internal user', () => {
    const user = {
      role: User.ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          irsPractitioners: [{ userId: '2' }],
          privatePractitioners: [{ userId: '1' }],
        },
        form: {},
      },
    });
    expect(result.showEditPrivatePractitioners).toBeFalsy();
    expect(result.showEditIrsPractitioners).toBeFalsy();
  });

  it('should not show Seal Case button if user does not have SEAL_CASE permission', () => {
    const user = {
      role: User.ROLES.petitionsClerk, // does not have SEAL_CASE permission
      userId: '789',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        form: {},
      },
    });
    expect(result.showSealCaseButton).toBeFalsy();
  });

  it('should show Seal Case button if user has SEAL_CASE permission and case is not already sealed', () => {
    const user = {
      role: User.ROLES.docketClerk, // has SEAL_CASE permission
      userId: '789',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        form: {},
      },
    });
    expect(result.showSealCaseButton).toBeTruthy();
  });

  it('should not show Seal Case button if user has SEAL_CASE permission and case is already sealed', () => {
    const user = {
      role: User.ROLES.docketClerk, // has SEAL_CASE permission
      userId: '789',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { isSealed: true },
        form: {},
      },
    });
    expect(result.showSealCaseButton).toBeFalsy();
  });
});
