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
      role: User.ROLES.practitioner,
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

  it('should show edit practitioners and respondents buttons if user is an internal user and there are practitioners and respondents on the case', () => {
    const user = {
      role: User.ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          practitioners: [{ userId: '1' }],
          respondents: [{ userId: '2' }],
        },
        form: {},
      },
    });
    expect(result.showEditPractitioners).toBeTruthy();
    expect(result.showEditRespondents).toBeTruthy();
  });

  it('should not show edit practitioners or respondents buttons if user is an internal user and there are not practitioners and respondents on the case', () => {
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
    expect(result.showEditPractitioners).toBeFalsy();
    expect(result.showEditRespondents).toBeFalsy();
  });

  it('should not show edit practitioners or respondents buttons if user is not an internal user', () => {
    const user = {
      role: User.ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          practitioners: [{ userId: '1' }],
          respondents: [{ userId: '2' }],
        },
        form: {},
      },
    });
    expect(result.showEditPractitioners).toBeFalsy();
    expect(result.showEditRespondents).toBeFalsy();
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
