import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { caseInformationHelper as caseInformationHelperComputed } from './caseInformationHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('caseInformationHelper', () => {
  const mockPetitionsClerk = {
    role: ROLES.petitionsClerk,
    userId: '0dd60083-ab1f-4a43-95f8-bfbc69b48777',
  };
  const mockDocketClerk = {
    role: ROLES.docketClerk,
    userId: 'a09053ab-58c7-4384-96a1-bd5fbe14977a',
  };

  const caseInformationHelper = withAppContextDecorator(
    caseInformationHelperComputed,
    applicationContext,
  );

  const getBaseState = user => {
    mockUser = { ...user };
    return {
      permissions: getUserPermissions(user),
    };
  };

  let mockUser;

  beforeEach(() => {
    mockUser = {};
    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
  });

  describe('showUnsealCaseButton', () => {
    it('should be false when the user has UNSEAL_CASE permission and case is not already sealed', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk), // has SEAL_CASE permission
          caseDetail: { isSealed: false, petitioners: [], sealedDate: null },
          form: {},
        },
      });

      expect(result.showUnsealCaseButton).toEqual(false);
    });

    it('should be true when the user has UNSEAL_CASE permission and case is already sealed', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk), // has SEAL_CASE permission
          caseDetail: {
            isSealed: true,
            petitioners: [],
            sealedDate: '2020/01/01',
          },
          form: {},
        },
      });

      expect(result.showUnsealCaseButton).toEqual(true);
    });

    it('should be false when the user does not have UNSEAL_CASE permission', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(mockPetitionsClerk), // does not have SEAL_CASE permission
          caseDetail: {
            petitioners: [],
          },
          form: {},
        },
      });

      expect(result.showUnsealCaseButton).toEqual(false);
    });
  });
});
