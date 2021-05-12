import {
  CONTACT_TYPES,
  INITIAL_DOCUMENT_TYPES,
  OTHER_FILER_TYPES,
  ROLES,
  UNIQUE_OTHER_FILER_TYPE,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { partiesInformationHelper as partiesInformationHelperComputed } from './partiesInformationHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('partiesInformationHelper', () => {
  const mockEmail = 'test@example.com';

  const mockIntervenor = {
    contactId: '59ab3015-5072-4d70-a66a-f83265b1e77d',
    contactType: CONTACT_TYPES.otherFiler,
    otherFilerType: UNIQUE_OTHER_FILER_TYPE,
  };
  const mockParticipant = {
    contactId: '25d51a3b-969e-4bb4-a932-cc9645ba888c',
    contactType: CONTACT_TYPES.otherFiler,
    otherFilerType: OTHER_FILER_TYPES[1],
  };
  const mockPetitionsClerk = {
    role: ROLES.petitionsClerk,
    userId: '0dd60083-ab1f-4a43-95f8-bfbc69b48777',
  };
  const mockDocketClerk = {
    role: ROLES.docketClerk,
    userId: 'a09053ab-58c7-4384-96a1-bd5fbe14977a',
  };
  const mockPetitioner = {
    contactId: 'f94cef8e-17b8-4504-9296-af911b32020a',
    contactType: CONTACT_TYPES.primary,
    role: ROLES.petitioner,
    userId: 'f94cef8e-17b8-4504-9296-af911b32020a',
  };
  const mockPrivatePractitioner = {
    barNumber: 'PT8888',
    email: mockEmail,
    name: 'Test Name',
    representing: [mockPetitioner.contactId],
    role: ROLES.privatePractitioner,
    userId: '39f7c7ee-ab75-492a-a4ee-63755a24e845',
  };
  const mockIrsPractitioner = {
    barNumber: 'RT1111',
    email: mockEmail,
    name: 'Test IRS',
    role: ROLES.irsPractitioner,
    userId: 'c6df4afc-286b-4979-92e2-b788e49dc51d',
  };

  const partiesInformationHelper = withAppContextDecorator(
    partiesInformationHelperComputed,
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

  describe('formattedParticipants', () => {
    it('should set representing practitioners and formattedTitle when they exist on the participant', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockIntervenor, mockParticipant],
            privatePractitioners: [mockPrivatePractitioner],
          },
          permissions: {},
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedParticipants).toMatchObject([
        {
          ...mockIntervenor,
          formattedTitle: UNIQUE_OTHER_FILER_TYPE,
          hasCounsel: true,
          representingPractitioners: [mockPrivatePractitioner],
        },
        {
          ...mockParticipant,
          formattedTitle: 'Participant',
          hasCounsel: true,
          representingPractitioners: [mockPrivatePractitioner],
        },
      ]);
      expect(result.formattedPetitioners).toEqual([]);
    });
  });

  describe('formattedPetitioners', () => {
    it('should set representingPractitioners and their pending emails when they exist for a petitioner', () => {
      const mockPendingPractitionerEmail = 'pendingPractitioner@example.com';

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            ...getBaseState(mockDocketClerk),
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [
              {
                ...mockPrivatePractitioner,
                representing: [mockPetitioner.contactId],
              },
            ],
          },
          permissions: {},
          screenMetadata: {
            pendingEmails: {
              [mockPrivatePractitioner.userId]: mockPendingPractitionerEmail,
            },
          },
        },
      });

      expect(result.formattedPetitioners).toMatchObject([
        {
          ...mockPetitioner,
          hasCounsel: true,
          representingPractitioners: [
            {
              ...mockPrivatePractitioner,
              formattedPendingEmail: `${mockPendingPractitionerEmail} (Pending)`,
              representing: [mockPetitioner.contactId],
            },
          ],
        },
      ]);
      expect(result.formattedParticipants).toEqual([]);
    });

    it('should set representingPractitioners and their emails when they exist for a petitioner', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [
              {
                ...mockPrivatePractitioner,
                representing: [mockPetitioner.contactId],
              },
            ],
          },
          permissions: {},
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners).toMatchObject([
        {
          ...mockPetitioner,
          hasCounsel: true,
          representingPractitioners: [
            {
              ...mockPrivatePractitioner,
              formattedEmail: mockEmail,
              representing: [mockPetitioner.contactId],
            },
          ],
        },
      ]);
    });

    it("should set representingPractitioners.formattedEmail to `No email provided` when the petitioner's counsel does not have an email", () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [
              { ...mockPrivatePractitioner, email: undefined },
            ],
          },
          permissions: {},
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners).toMatchObject([
        {
          ...mockPetitioner,
          hasCounsel: true,
          representingPractitioners: [
            {
              ...mockPrivatePractitioner,
              formattedEmail: 'No email provided',
            },
          ],
        },
      ]);
    });

    it('should set hasCounsel to false for a petitioner that is not represented', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [mockPrivatePractitioner],
          },
          permissions: {},
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners).toMatchObject([
        {
          ...mockPetitioner,
          hasCounsel: false,
          representingPractitioners: [],
        },
      ]);
    });

    it('should set formattedEmail for a petitioner that has a verified email', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [mockPrivatePractitioner],
          },
          permissions: {},
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners[0].formattedEmail).toBe(mockEmail);
    });

    it('should set formattedEmail to `No email provided` for a petitioner that does not have a verified email', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [mockPrivatePractitioner],
          },
          permissions: {},
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners[0].formattedEmail).toBe(
        'No email provided',
      );
    });

    it('should set formattedPendingEmail when the petitioner has a pending email', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [mockPrivatePractitioner],
          },
          permissions: {},
          screenMetadata: {
            pendingEmails: {
              [mockPetitioner.contactId]: mockEmail,
            },
          },
        },
      });

      expect(result.formattedPetitioners[0].formattedPendingEmail).toBe(
        `${mockEmail} (Pending)`,
      );
    });

    it('should set formattedPendingEmail to undefined when the petitioner has no pending email', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [mockPrivatePractitioner],
          },
          permissions: {},
          screenMetadata: {
            pendingEmails: {
              [mockPetitioner.contactId]: undefined,
            },
          },
        },
      });

      expect(
        result.formattedPetitioners[0].formattedPendingEmail,
      ).toBeUndefined();
    });
  });

  describe('formattedRespondents', () => {
    it('should set formattedEmail when it exists', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            irsPractitioners: [mockIrsPractitioner],
            petitioners: [],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedRespondents[0].formattedEmail).toBe(mockEmail);
    });

    it('should set canEditRespondent to true for internal users', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            irsPractitioners: [
              {
                ...mockIrsPractitioner,
                email: undefined,
              },
            ],
            petitioners: [],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedRespondents[0].canEditRespondent).toBeTruthy();
    });

    it('should set canEditRespondent to false for external users', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockPetitioner),
          caseDetail: {
            irsPractitioners: [
              {
                ...mockIrsPractitioner,
                email: undefined,
              },
            ],
            petitioners: [],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedRespondents[0].canEditRespondent).toBeFalsy();
    });

    it('should set formattedEmail to `No email provided` when the respondent does not have an email set', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            irsPractitioners: [{ ...mockIrsPractitioner, email: undefined }],
            petitioners: [],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedRespondents[0].formattedEmail).toBe(
        'No email provided',
      );
    });

    it('should set formattedPendingEmail when the respondent has a pending email', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            irsPractitioners: [mockIrsPractitioner],
            petitioners: [],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {
              [mockIrsPractitioner.userId]: mockEmail,
            },
          },
        },
      });

      expect(result.formattedRespondents[0].formattedPendingEmail).toBe(
        `${mockEmail} (Pending)`,
      );
    });

    it('should set formattedPendingEmail to undefined when the respondent has no pending email', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            irsPractitioners: [{ ...mockIrsPractitioner, email: undefined }],
            petitioners: [],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {
              [mockIrsPractitioner.userId]: undefined,
            },
          },
        },
      });

      expect(
        result.formattedRespondents[0].formattedPendingEmail,
      ).toBeUndefined();
    });
  });

  describe('showParticipantsTab', () => {
    it('should be false when the case does not have any participants or intervenors', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.showParticipantsTab).toEqual(false);
    });

    it('should be true when the case has at least one participant', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.showParticipantsTab).toEqual(true);
    });
  });

  describe('canEditPetitioner', () => {
    it('is false when the petition has not been served', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            docketEntries: [
              {
                documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
                servedAt: undefined,
              },
            ],
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [],
          },
          permissions: { EDIT_PETITIONER_INFO: true },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners[0].canEditPetitioner).toBe(false);
    });

    it('is true when the user is an internal user with permission to edit petitioner info and the petition has been served', () => {
      const mockPetitioner = {
        contactType: CONTACT_TYPES.primary,
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockDocketClerk),
          caseDetail: {
            docketEntries: [
              {
                documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
                servedAt: '2020-08-01',
              },
            ],
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [],
          },
          permissions: { EDIT_PETITIONER_INFO: true },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners[0].canEditPetitioner).toBe(true);
    });

    it('is false when the user is an internal user without permission to edit petitioner info', () => {
      const mockPetitioner = {
        contactType: CONTACT_TYPES.primary,
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockPetitionsClerk),
          caseDetail: {
            docketEntries: [
              {
                documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
                servedAt: '2020-08-01',
              },
            ],
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [],
          },
          permissions: { EDIT_PETITIONER_INFO: false },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners[0].canEditPetitioner).toBe(false);
    });

    it('is true when the user is the corresponding petitioner and the petition has been served', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockPetitioner),
          caseDetail: {
            docketEntries: [
              {
                documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
                servedAt: '2020-08-01',
              },
            ],
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners[0].canEditPetitioner).toBe(true);
    });

    it('is false when the user is not the corresponding petitioner and the petition has been served', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockPetitioner),
          caseDetail: {
            docketEntries: [
              {
                documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
                servedAt: '2020-08-01',
              },
            ],
            irsPractitioners: [],
            petitioners: [
              {
                ...mockPetitioner,
                contactId: '38eb11a1-53be-4a5d-967c-b7334ddfd82f',
              },
            ],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners[0].canEditPetitioner).toBeFalsy();
    });

    it('is true when the current user is a private practitioner associated with the case and the petition has been served', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            ...getBaseState(mockPrivatePractitioner),
            docketEntries: [
              {
                documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
                servedAt: '2020-08-01',
              },
            ],
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [
              {
                ...mockPrivatePractitioner,
                representing: [mockPetitioner.contactId],
              },
            ],
          },
          permissions: {},
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners[0].canEditPetitioner).toBeTruthy();
    });

    it('is false when the current user is a private practitioner not associated with the case and the petition has been served', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockPrivatePractitioner),
          caseDetail: {
            docketEntries: [
              {
                documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
                servedAt: '2020-08-01',
              },
            ],
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [],
          },
          permissions: {},
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners[0].canEditPetitioner).toBeFalsy();
    });
  });
});
