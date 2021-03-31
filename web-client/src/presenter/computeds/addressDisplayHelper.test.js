import {
  CASE_STATUS_TYPES,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { addressDisplayHelper as addressDisplayHelperComputed } from './addressDisplayHelper';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const addressDisplayHelper = withAppContextDecorator(
  addressDisplayHelperComputed,
  {
    ...applicationContext,
    getCurrentUser: () => {
      return globalUser;
    },
  },
);

let globalUser;

const getBaseState = user => {
  globalUser = user;
  return {
    permissions: getUserPermissions(user),
  };
};

describe('address display', () => {
  describe('showEditContacts', () => {
    it('should be true if user is a petitioner role', () => {
      const user = {
        role: ROLES.petitioner,
        userId: '789',
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {},
          currentPage: 'CaseDetailInternal',
          permissions: { EDIT_PETITIONER_INFO: true },
        },
      });

      expect(result.showEditContacts).toEqual(true);
    });

    it('should be true if user is a privatePractitioner role and userAssociatedWithCase is true', () => {
      const user = {
        role: ROLES.privatePractitioner,
        userId: '789',
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {},
          currentPage: 'CaseDetailInternal',
          permissions: { EDIT_PETITIONER_INFO: true },
          screenMetadata: { isAssociated: true },
        },
      });

      expect(result.showEditContacts).toEqual(true);
    });

    it('should be false if user is a privatePractitioner role and userAssociatedWithCase is false', () => {
      const user = {
        role: ROLES.privatePractitioner,
        userId: '789',
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {},
          currentPage: 'CaseDetailInternal',
          permissions: { EDIT_PETITIONER_INFO: true },
          screenMetadata: { isAssociated: false },
        },
      });

      expect(result.showEditContacts).toEqual(false);
    });
  });

  describe('showEditPetitionerInformation', () => {
    it('should allow the user to edit the petitioner information if have the EDIT_PETITIONER_INFO permission', () => {
      const user = {
        role: ROLES.docketClerk,
        userId: '789',
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [],
            privatePractitioners: [{ userId: '789' }],
          },
          currentPage: 'CaseDetailInternal',
          permissions: { EDIT_PETITIONER_INFO: true },
        },
      });

      expect(result.showEditPetitionerInformation).toEqual(true);
    });

    it('should not allow the user to edit the petitioner information if they have the EDIT_PETITIONER_INFO permission but case status is new', () => {
      const user = {
        role: ROLES.docketClerk,
        userId: '789',
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [],
            privatePractitioners: [{ userId: '789' }],
            status: CASE_STATUS_TYPES.new,
          },
          currentPage: 'CaseDetailInternal',
          permissions: { EDIT_PETITIONER_INFO: true },
        },
      });

      expect(result.showEditPetitionerInformation).toBeFalsy();
    });

    it('should not allow the user to edit the petitioner information if they have the incorrect permission', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '789',
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [],
            privatePractitioners: [{ userId: '789' }],
          },
          currentPage: 'CaseDetailInternal',
          permissions: { EDIT_PETITIONER_INFO: false },
        },
      });

      expect(result.showEditPetitionerInformation).toEqual(false);
    });
  });
});
