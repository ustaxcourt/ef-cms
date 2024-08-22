import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { caseInformationHelper as caseInformationHelperComputed } from './caseInformationHelper';
import { docketClerkUser, petitionsClerkUser } from '@shared/test/mockUsers';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('caseInformationHelper', () => {
  const caseInformationHelper = withAppContextDecorator(
    caseInformationHelperComputed,
    applicationContext,
  );

  const getBaseState = user => {
    return {
      permissions: getUserPermissions(user),
      user,
    };
  };

  describe('showUnsealCaseButton', () => {
    it('should be false when the user has UNSEAL_CASE permission and case is not already sealed', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser), // has SEAL_CASE permission
          caseDetail: { isSealed: false, petitioners: [], sealedDate: null },
          form: {},
        },
      });

      expect(result.showUnsealCaseButton).toEqual(false);
    });

    it('should be true when the user has UNSEAL_CASE permission and case is already sealed', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser), // has SEAL_CASE permission
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
          ...getBaseState(petitionsClerkUser), // does not have SEAL_CASE permission
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
