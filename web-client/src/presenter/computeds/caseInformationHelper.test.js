import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
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
      role: ROLES.docketClerk,
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
      role: ROLES.privatePractitioner,
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
      role: ROLES.docketClerk,
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
      role: ROLES.docketClerk,
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
      role: ROLES.petitioner,
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
      role: ROLES.petitionsClerk, // does not have SEAL_CASE permission
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
      role: ROLES.docketClerk, // has SEAL_CASE permission
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
      role: ROLES.docketClerk, // has SEAL_CASE permission
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

  describe('other petitioners', () => {
    let baseState;

    beforeEach(() => {
      const user = {
        role: ROLES.docketClerk, // has SEAL_CASE permission
        userId: '789',
      };

      baseState = {
        ...getBaseState(user),
        caseDetail: {},
        form: {},
      };
    });

    it('shows "Hide" display if showingAdditionalPetitioners is true', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...baseState,
          showingAdditionalPetitioners: true,
        },
      });

      expect(result.toggleAdditionalPetitionersDisplay).toEqual('Hide');
    });

    it('shows "View" display if showingAdditionalPetitioners is false', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...baseState,
          showingAdditionalPetitioners: false,
        },
      });

      expect(result.toggleAdditionalPetitionersDisplay).toEqual('View');
    });

    it('does not paginate (or show) other petitioners if it is non-existent', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...baseState,
        },
      });

      expect(result.formattedOtherPetitioners).toEqual([]);
      expect(result.showOtherPetitioners).toEqual(false);
    });

    it('paginates if showingAdditionalPetitioners is false', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...baseState,
          caseDetail: {
            otherPetitioners: [
              { a: '1' },
              { a: '1' },
              { a: '1' },
              { a: '1' },
              { a: '1' },
            ],
          },
          showingAdditionalPetitioners: false,
        },
      });

      expect(result.formattedOtherPetitioners.length).toEqual(4);
      expect(result.showOtherPetitioners).toEqual(true);
    });

    it('does not paginate (shows all) if showingAdditionalPetitioners is true', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...baseState,
          caseDetail: {
            otherPetitioners: [
              { a: '1' },
              { a: '1' },
              { a: '1' },
              { a: '1' },
              { a: '1' },
            ],
          },
          showingAdditionalPetitioners: true,
        },
      });

      expect(result.formattedOtherPetitioners.length).toEqual(5);
      expect(result.showOtherPetitioners).toEqual(true);
    });
  });
});
