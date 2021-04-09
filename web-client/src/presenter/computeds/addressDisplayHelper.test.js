import {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  INITIAL_DOCUMENT_TYPES,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { addressDisplayHelper as addressDisplayHelperComputed } from './addressDisplayHelper';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('addressDisplayHelper', () => {
  let globalUser;

  const mockUserId = 'f50f9f1e-473e-41b5-8c3d-89ddf56649ef';
  const mockSecondPetitionerId = '3852b946-3343-400e-a713-a43a22dd8d86';

  const mockPetitioners = [
    {
      contactId: mockUserId,
      contactType: CONTACT_TYPES.primary,
      isAddressSealed: false,
    },
    {
      contactId: mockSecondPetitionerId,
      contactType: CONTACT_TYPES.secondary,
      isAddressSealed: false,
    },
  ];

  const getBaseState = user => {
    globalUser = user;
    return {
      permissions: getUserPermissions(user),
    };
  };

  const addressDisplayHelper = withAppContextDecorator(
    addressDisplayHelperComputed,
    {
      ...applicationContext,
      getCurrentUser: () => {
        return globalUser;
      },
    },
  );

  it('should not throw an error when retrieving contact primary when state.caseDetail is empty', () => {
    const user = {
      role: ROLES.petitioner,
      userId: mockUserId,
    };

    expect(() =>
      runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {},
          form: {
            contactPrimary: {
              contactId: mockUserId,
              name: 'Hi primary',
            },
          },
          permissions: {},
        },
      }),
    ).not.toThrow();
  });

  it('should not throw an error when retrieving contact secondary when state.caseDetail is empty', () => {
    const user = {
      role: ROLES.petitioner,
      userId: mockUserId,
    };

    expect(() =>
      runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {},
          form: {
            contactPrimary: {
              contactId: mockUserId,
              name: 'Hi primary',
            },
            contactSecondary: {
              contactId: mockSecondPetitionerId,
              name: 'Hi secondary',
            },
          },
          permissions: {},
        },
      }),
    ).not.toThrow();
  });

  describe('primary.showEditContact', () => {
    it('should be true if the current user is primary, the address is not sealed and the case has been served', () => {
      const user = {
        role: ROLES.petitioner,
        userId: mockUserId,
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [
              {
                documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
                servedAt: '2019-08-25T05:00:00.000Z',
              },
            ],
            petitioners: [
              {
                contactId: mockUserId,
                contactType: CONTACT_TYPES.primary,
                isAddressSealed: false,
              },
            ],
          },
          currentPage: 'CaseDetailInternal',
          permissions: {},
        },
      });

      expect(result.primary.showEditContact).toEqual(true);
    });

    it('should be false when the current user is primary, the address is not sealed and the case has not been served', () => {
      const user = {
        role: ROLES.petitioner,
        userId: mockUserId,
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [
              {
                documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
                servedAt: undefined,
              },
            ],
            petitioners: [
              {
                contactId: mockUserId,
                contactType: CONTACT_TYPES.primary,
                isAddressSealed: false,
              },
            ],
          },
          currentPage: 'CaseDetailInternal',
          permissions: {},
        },
      });

      expect(result.primary.showEditContact).toEqual(false);
    });

    it('should be false if the current user is primary and the address is sealed', () => {
      const user = {
        role: ROLES.petitioner,
        userId: mockUserId,
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [],
            petitioners: [
              {
                contactId: mockUserId,
                contactType: CONTACT_TYPES.primary,
                isAddressSealed: true,
              },
            ],
          },
          currentPage: 'CaseDetailInternal',
          permissions: {},
        },
      });

      expect(result.primary.showEditContact).toEqual(false);
    });

    it('should be false if the current user is not the primary contact and the address is not sealed', () => {
      const user = {
        role: ROLES.petitioner,
        userId: mockSecondPetitionerId,
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [],
            petitioners: [
              {
                contactId: mockUserId,
                contactType: CONTACT_TYPES.primary,
                isAddressSealed: false,
              },
            ],
          },
          currentPage: 'CaseDetailInternal',
          permissions: {},
        },
      });

      expect(result.primary.showEditContact).toEqual(false);
    });

    it('should be true if current user is a private practitioner, address is not sealed, current user is associated to case and the case has been served', () => {
      const user = {
        role: ROLES.privatePractitioner,
        userId: mockSecondPetitionerId,
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [
              {
                documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
                servedAt: '2019-08-25T05:00:00.000Z',
              },
            ],
            petitioners: [
              {
                contactId: mockUserId,
                contactType: CONTACT_TYPES.primary,
                isAddressSealed: false,
              },
            ],
          },
          currentPage: 'CaseDetailInternal',
          permissions: {},
          screenMetadata: { isAssociated: true },
        },
      });

      expect(result.primary.showEditContact).toEqual(true);
    });

    it('should be false when current user is a private practitioner, address is not sealed, current user is associated to case and the case has not been served', () => {
      const user = {
        role: ROLES.privatePractitioner,
        userId: mockSecondPetitionerId,
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [
              {
                documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
                servedAt: undefined,
              },
            ],
            petitioners: [
              {
                contactId: mockUserId,
                contactType: CONTACT_TYPES.primary,
                isAddressSealed: false,
              },
            ],
          },
          currentPage: 'CaseDetailInternal',
          permissions: {},
          screenMetadata: { isAssociated: true },
        },
      });

      expect(result.primary.showEditContact).toEqual(false);
    });
  });

  describe('primary.showSealedContact', () => {
    it('should be true if the current user is primary and the address is sealed', () => {
      const user = {
        role: ROLES.petitioner,
        userId: mockUserId,
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [],
            petitioners: [
              {
                contactId: mockUserId,
                contactType: CONTACT_TYPES.primary,
                isAddressSealed: true,
              },
            ],
          },
          currentPage: 'CaseDetailInternal',
          permissions: {},
        },
      });

      expect(result.primary.showSealedContact).toEqual(true);
    });

    it('should be false if the current user is primary and the address is not sealed', () => {
      const user = {
        role: ROLES.petitioner,
        userId: mockUserId,
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [],
            petitioners: [
              {
                contactId: mockUserId,
                contactType: CONTACT_TYPES.primary,
                isAddressSealed: false,
              },
            ],
          },
          currentPage: 'CaseDetailInternal',
          permissions: {},
        },
      });

      expect(result.primary.showSealedContact).toEqual(false);
    });

    it('should be false if the current user is not the primary contact and the address is sealed', () => {
      const user = {
        role: ROLES.petitioner,
        userId: mockSecondPetitionerId,
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [],
            petitioners: [
              {
                contactId: mockUserId,
                contactType: CONTACT_TYPES.primary,
                isAddressSealed: true,
              },
            ],
          },
          currentPage: 'CaseDetailInternal',
          permissions: {},
        },
      });

      expect(result.primary.showSealedContact).toEqual(false);
    });

    it('should be true if current user is a private practitioner, address is not sealed, and current user is associated to case', () => {
      const user = {
        role: ROLES.privatePractitioner,
        userId: mockSecondPetitionerId,
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [
              {
                documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
                servedAt: '2019-08-25T05:00:00.000Z',
              },
            ],
            petitioners: [
              {
                contactId: mockUserId,
                contactType: CONTACT_TYPES.primary,
                isAddressSealed: false,
              },
            ],
          },
          currentPage: 'CaseDetailInternal',
          permissions: {},
          screenMetadata: { isAssociated: true },
        },
      });

      expect(result.primary.showEditContact).toEqual(true);
    });
  });

  describe('secondary.showEditContact', () => {
    it('should be true if the current user is secondary, the address is not sealed, and the case has been served', () => {
      const user = {
        role: ROLES.petitioner,
        userId: mockUserId,
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [
              {
                documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
                servedAt: '2019-08-25T05:00:00.000Z',
              },
            ],
            petitioners: [
              mockPetitioners[0],
              {
                contactId: mockUserId,
                contactType: CONTACT_TYPES.secondary,
                isAddressSealed: false,
              },
            ],
          },
          currentPage: 'CaseDetailInternal',
          permissions: {},
        },
      });

      expect(result.secondary.showEditContact).toEqual(true);
    });

    it('should be false when the current user is secondary, the address is not sealed, and the case has not been served', () => {
      const user = {
        role: ROLES.petitioner,
        userId: mockUserId,
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [
              {
                documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
                servedAt: undefined,
              },
            ],
            petitioners: [
              mockPetitioners[0],
              {
                contactId: mockUserId,
                contactType: CONTACT_TYPES.secondary,
                isAddressSealed: false,
              },
            ],
          },
          currentPage: 'CaseDetailInternal',
          permissions: {},
        },
      });

      expect(result.secondary.showEditContact).toEqual(false);
    });

    it('should be false if the current user is secondary and the address is sealed', () => {
      const user = {
        role: ROLES.petitioner,
        userId: mockUserId,
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [],
            petitioners: [
              mockPetitioners[0],
              {
                contactId: mockUserId,
                contactType: CONTACT_TYPES.secondary,
                isAddressSealed: true,
              },
            ],
          },
          currentPage: 'CaseDetailInternal',
          permissions: {},
        },
      });

      expect(result.secondary.showEditContact).toEqual(false);
    });

    it('should be false if the current user is not the secondary contact and the address is not sealed', () => {
      const user = {
        role: ROLES.petitioner,
        userId: mockSecondPetitionerId,
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [],
            petitioners: [
              mockPetitioners[0],
              {
                contactId: mockUserId,
                contactType: CONTACT_TYPES.secondary,
                isAddressSealed: false,
              },
            ],
          },
          currentPage: 'CaseDetailInternal',
          permissions: {},
        },
      });

      expect(result.secondary.showEditContact).toEqual(false);
    });
  });

  describe('secondary.showSealedContact', () => {
    it('should be true if the current user is secondary and the address is sealed', () => {
      const user = {
        role: ROLES.petitioner,
        userId: mockUserId,
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [],
            petitioners: [
              mockPetitioners[0],
              {
                contactId: mockUserId,
                contactType: CONTACT_TYPES.secondary,
                isAddressSealed: true,
              },
            ],
          },
          currentPage: 'CaseDetailInternal',
          permissions: {},
        },
      });

      expect(result.secondary.showSealedContact).toEqual(true);
    });

    it('should be false if the current user is secondary and the address is not sealed', () => {
      const user = {
        role: ROLES.petitioner,
        userId: mockUserId,
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [],
            petitioners: [
              mockPetitioners[0],
              {
                contactId: mockUserId,
                contactType: CONTACT_TYPES.secondary,
                isAddressSealed: false,
              },
            ],
          },
          currentPage: 'CaseDetailInternal',
          permissions: {},
        },
      });

      expect(result.secondary.showSealedContact).toEqual(false);
    });

    it('should be false if the current user is not the secondary contact and the address is sealed', () => {
      const user = {
        role: ROLES.petitioner,
        userId: mockSecondPetitionerId,
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [],
            petitioners: [
              mockPetitioners[0],
              {
                contactId: mockUserId,
                contactType: CONTACT_TYPES.secondary,
                isAddressSealed: true,
              },
            ],
          },
          currentPage: 'CaseDetailInternal',
          permissions: {},
        },
      });

      expect(result.secondary.showSealedContact).toEqual(false);
    });
  });

  describe('showEditPetitionerInformation', () => {
    it('should be true when the user has the EDIT_PETITIONER_INFO permission and the case has been served', () => {
      const user = {
        role: ROLES.docketClerk,
        userId: '789',
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [
              {
                documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
                servedAt: '2019-08-25T05:00:00.000Z',
              },
            ],
            petitioners: mockPetitioners,
            privatePractitioners: [{ userId: '789' }],
          },
          currentPage: 'CaseDetailInternal',
          permissions: { EDIT_PETITIONER_INFO: true },
        },
      });

      expect(result.showEditPetitionerInformation).toEqual(true);
    });

    it('should be false when the current user has the EDIT_PETITIONER_INFO permission but case status is new', () => {
      const user = {
        role: ROLES.docketClerk,
        userId: '789',
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [],
            petitioners: mockPetitioners,
            privatePractitioners: [{ userId: '789' }],
            status: CASE_STATUS_TYPES.new,
          },
          currentPage: 'CaseDetailInternal',
          permissions: { EDIT_PETITIONER_INFO: true },
        },
      });

      expect(result.showEditPetitionerInformation).toBeFalsy();
    });

    it('should be false when the current user has incorrect permissions', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '789',
      };

      const result = runCompute(addressDisplayHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            docketEntries: [],
            petitioners: mockPetitioners,
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
