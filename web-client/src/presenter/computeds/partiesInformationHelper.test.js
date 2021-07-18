import {
  CONTACT_TYPES,
  INITIAL_DOCUMENT_TYPES,
  ROLES,
  UNIQUE_OTHER_FILER_TYPE,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { docketClerkUser } from '../../../../shared/src/test/mockUsers';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { partiesInformationHelper as partiesInformationHelperComputed } from './partiesInformationHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('partiesInformationHelper', () => {
  const mockEmail = 'test@example.com';

  const mockIntervenor = {
    contactId: '59ab3015-5072-4d70-a66a-f83265b1e77d',
    contactType: CONTACT_TYPES.intervenor,
  };
  const mockParticipant = {
    contactId: '25d51a3b-969e-4bb4-a932-cc9645ba888c',
    contactType: CONTACT_TYPES.participant,
  };
  const mockPetitionsClerk = {
    role: ROLES.petitionsClerk,
    userId: '0dd60083-ab1f-4a43-95f8-bfbc69b48777',
  };
  let mockPetitioner;
  let mockPrivatePractitioner;
  let mockIrsPractitioner;

  const partiesInformationHelper = withAppContextDecorator(
    partiesInformationHelperComputed,
    applicationContext,
  );

  const getBaseState = user => {
    mockUser = { ...user };
    return {
      permissions: getUserPermissions(user),
      screenMetadata: { pendingEmails: {} },
    };
  };

  let mockUser;

  beforeEach(() => {
    mockUser = {};
    mockIrsPractitioner = {
      barNumber: 'RT1111',
      email: mockEmail,
      name: 'Test IRS',
      role: ROLES.irsPractitioner,
      userId: 'c6df4afc-286b-4979-92e2-b788e49dc51d',
    };
    mockPetitioner = {
      contactId: 'f94cef8e-17b8-4504-9296-af911b32020a',
      contactType: CONTACT_TYPES.primary,
      role: ROLES.petitioner,
      userId: 'f94cef8e-17b8-4504-9296-af911b32020a',
    };
    mockPrivatePractitioner = {
      barNumber: 'PT8888',
      email: mockEmail,
      name: 'Test Name',
      representing: [mockPetitioner.contactId],
      role: ROLES.privatePractitioner,
      userId: '39f7c7ee-ab75-492a-a4ee-63755a24e845',
    };
    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
  });

  describe('formattedParticipants', () => {
    it('should set representing practitioners and formattedTitle when they exist on the participant', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            petitioners: [mockIntervenor, mockParticipant],
            privatePractitioners: [
              {
                ...mockPrivatePractitioner,
                representing: [
                  mockIntervenor.contactId,
                  mockParticipant.contactId,
                ],
              },
            ],
          },
        },
      });

      expect(result.formattedParticipants).toMatchObject([
        {
          ...mockIntervenor,
          formattedTitle: UNIQUE_OTHER_FILER_TYPE,
          hasCounsel: true,
          representingPractitioners: [
            {
              ...mockPrivatePractitioner,
              representing: [
                mockIntervenor.contactId,
                mockParticipant.contactId,
              ],
            },
          ],
        },
        {
          ...mockParticipant,
          formattedTitle: 'Participant',
          hasCounsel: true,
          representingPractitioners: [
            {
              ...mockPrivatePractitioner,
              representing: [
                mockIntervenor.contactId,
                mockParticipant.contactId,
              ],
            },
          ],
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
          ...getBaseState(docketClerkUser),
          caseDetail: {
            petitioners: [mockPetitioner],
            privatePractitioners: [
              {
                ...mockPrivatePractitioner,
                representing: [mockPetitioner.contactId],
              },
            ],
          },
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
          ...getBaseState(docketClerkUser),
          caseDetail: {
            petitioners: [mockPetitioner],
            privatePractitioners: [
              {
                ...mockPrivatePractitioner,
                representing: [mockPetitioner.contactId],
              },
            ],
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
          ...getBaseState(docketClerkUser),
          caseDetail: {
            petitioners: [mockPetitioner],
            privatePractitioners: [
              { ...mockPrivatePractitioner, email: undefined },
            ],
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
              email: undefined,
              formattedEmail: 'No email provided',
            },
          ],
        },
      ]);
    });

    it('should set hasCounsel to false for a petitioner that is not represented', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            petitioners: [mockPetitioner],
            privatePractitioners: [
              { ...mockPrivatePractitioner, representing: [] },
            ],
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
          ...getBaseState(docketClerkUser),
          caseDetail: {
            petitioners: [{ ...mockPetitioner, email: mockEmail }],
            privatePractitioners: [mockPrivatePractitioner],
          },
        },
      });

      expect(result.formattedPetitioners[0].formattedEmail).toBe(mockEmail);
    });

    it('should set formattedEmail to the current email for a petitioner that has a verified email AND a pending email', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            petitioners: [{ ...mockPetitioner, email: mockEmail }],
            privatePractitioners: [mockPrivatePractitioner],
          },
          screenMetadata: {
            pendingEmails: { [mockPetitioner.contactId]: 'blah@example.com' },
          },
        },
      });

      expect(result.formattedPetitioners[0].formattedEmail).toEqual(mockEmail);
    });

    it('should set formattedEmail to undefined for a petitioner that does not have a verified email and has a pending email', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            petitioners: [{ ...mockPetitioner, email: undefined }],
            privatePractitioners: [mockPrivatePractitioner],
          },
          screenMetadata: {
            pendingEmails: { [mockPetitioner.contactId]: mockEmail },
          },
        },
      });

      expect(result.formattedPetitioners[0].formattedEmail).toBeUndefined();
    });

    it('should set formattedEmail to `No email provided` for a petitioner that does not have a verified email', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            petitioners: [mockPetitioner],
            privatePractitioners: [mockPrivatePractitioner],
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
          ...getBaseState(docketClerkUser),
          caseDetail: {
            petitioners: [mockPetitioner],
            privatePractitioners: [mockPrivatePractitioner],
          },
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
          ...getBaseState(docketClerkUser),
          caseDetail: {
            petitioners: [mockPetitioner],
            privatePractitioners: [mockPrivatePractitioner],
          },
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

    it('should set formattedPendingEmail to `Email Pending` when the petitioner has a pending email for an external user', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockPrivatePractitioner),
          caseDetail: {
            petitioners: [mockPetitioner],
            privatePractitioners: [mockPrivatePractitioner],
          },
          screenMetadata: {
            pendingEmails: {
              [mockPetitioner.contactId]: true,
            },
          },
        },
      });

      expect(result.formattedPetitioners[0].formattedPendingEmail).toBe(
        'Email Pending',
      );
    });
  });

  describe('formattedRespondents', () => {
    it("should set formattedEmail to the counsel's email when it is defined and there is no pending email", () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            irsPractitioners: [mockIrsPractitioner],
          },
        },
      });

      expect(result.formattedRespondents[0].formattedEmail).toBe(mockEmail);
    });

    it('should set formattedEmail to `No email provided` when the respondent does not have an email or a pending email', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            irsPractitioners: [{ ...mockIrsPractitioner, email: undefined }],
          },
        },
      });

      expect(result.formattedRespondents[0].formattedEmail).toBe(
        'No email provided',
      );
    });

    it('should set formattedEmail to undefined, and set formattedPending email when the respondent does not have an email but has a pending email', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            irsPractitioners: [{ ...mockIrsPractitioner, email: undefined }],
          },
          screenMetadata: {
            pendingEmails: {
              [mockIrsPractitioner.userId]: mockEmail,
            },
          },
        },
      });

      expect(result.formattedRespondents[0].formattedEmail).toBeUndefined();
      expect(result.formattedRespondents[0].formattedPendingEmail).toBe(
        `${mockEmail} (Pending)`,
      );
    });

    it('should set formattedPendingEmail when the respondent has a pending email and formattedEmail to email when it is defined', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            irsPractitioners: [
              { ...mockIrsPractitioner, email: 'lalal@example' },
            ],
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
      expect(result.formattedRespondents[0].formattedEmail).toBe(
        'lalal@example',
      );
    });

    it('should set formattedPendingEmail when the respondent has a pending email and formattedEmail to undefined when it is the same as the pending email', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            irsPractitioners: [{ ...mockIrsPractitioner, email: mockEmail }],
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
      expect(result.formattedRespondents[0].formattedEmail).toBeUndefined();
    });

    it('should not set formattedPendingEmail when the respondent has no pending email', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            irsPractitioners: [mockIrsPractitioner],
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

    it('should not set formattedPendingEmail when screenMetadata.pendingEmails is undefined', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            irsPractitioners: [mockIrsPractitioner],
          },
        },
      });

      expect(
        result.formattedRespondents[0].formattedPendingEmail,
      ).toBeUndefined();
    });

    it('should set canEditRespondent to true for internal users', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            irsPractitioners: [
              {
                ...mockIrsPractitioner,
                email: undefined,
              },
            ],
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
          },
        },
      });

      expect(result.formattedRespondents[0].canEditRespondent).toBeFalsy();
    });
  });

  describe('showParticipantsTab', () => {
    it('should be false when the case does not have any participants or intervenors', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            petitioners: [mockPetitioner],
          },
        },
      });

      expect(result.showParticipantsTab).toEqual(false);
    });

    it('should be true when the case has at least one participant', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            petitioners: [mockPetitioner, mockParticipant],
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
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
                servedAt: undefined,
              },
            ],
            petitioners: [mockPetitioner],
          },
        },
      });

      expect(result.formattedPetitioners[0].canEditPetitioner).toBe(false);
    });

    it('is true when the user is an internal user with permission to edit petitioner info and the petition has been served', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
                servedAt: '2020-08-01',
              },
            ],
            petitioners: [
              {
                contactType: CONTACT_TYPES.primary,
              },
            ],
          },
        },
      });

      expect(result.formattedPetitioners[0].canEditPetitioner).toBe(true);
    });

    it('is false when the petitioner is otherPetitioner and we are logged in as an external user', () => {
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
            petitioners: [
              {
                contactType: CONTACT_TYPES.otherPetitioner,
              },
            ],
          },
        },
      });

      expect(result.formattedPetitioners[0].canEditPetitioner).toBe(false);
    });

    it('is false when the user is an internal user without permission to edit petitioner info', () => {
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
            petitioners: [
              {
                contactType: CONTACT_TYPES.primary,
              },
            ],
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
            petitioners: [mockPetitioner],
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
            petitioners: [
              {
                ...mockPetitioner,
                contactId: '38eb11a1-53be-4a5d-967c-b7334ddfd82f',
              },
            ],
          },
        },
      });

      expect(result.formattedPetitioners[0].canEditPetitioner).toBeFalsy();
    });

    it('is true when the current user is a private practitioner associated with the case and the petition has been served', () => {
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
            petitioners: [mockPetitioner],
            privatePractitioners: [
              {
                ...mockPrivatePractitioner,
                representing: [mockPetitioner.contactId],
              },
            ],
          },
        },
      });

      expect(result.formattedPetitioners[0].canEditPetitioner).toBeTruthy();
    });

    it('is false when the current user is a private practitioner associated with the case and the petition has been served BUT the petitioner is an otherPetitioner', () => {
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
            petitioners: [
              {
                ...mockPetitioner,
                contactType: CONTACT_TYPES.primary,
              },
            ],
            privatePractitioners: [
              {
                ...mockPrivatePractitioner,
                representing: [mockPetitioner.contactId],
              },
            ],
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
            petitioners: [mockPetitioner],
          },
        },
      });

      expect(result.formattedPetitioners[0].canEditPetitioner).toBeFalsy();
    });

    it('should not throw an exception when privatePractitioners is undefined', () => {
      expect(() =>
        runCompute(partiesInformationHelper, {
          state: {
            ...getBaseState(mockPrivatePractitioner),
            caseDetail: {
              docketEntries: [
                {
                  documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
                  servedAt: '2020-08-01',
                },
              ],
              petitioners: [mockPetitioner],
            },
          },
        }),
      ).not.toThrow();
    });
  });

  describe('editPetitionerLink', () => {
    it('should return external contact edit link when the user is external', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockPetitioner),
          caseDetail: {
            docketNumber: '101-19',
            petitioners: [mockPetitioner],
          },
        },
      });
      expect(result.formattedPetitioners[0].editPetitionerLink).toBe(
        `/case-detail/101-19/contacts/${mockPetitioner.contactId}/edit`,
      );
    });

    it('should return edit-petitioner-information url if the user is internal', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketNumber: '101-19',
            petitioners: [mockPetitioner],
          },
        },
      });
      expect(result.formattedPetitioners[0].editPetitionerLink).toBe(
        `/case-detail/101-19/edit-petitioner-information/${mockPetitioner.contactId}`,
      );
    });
  });

  describe('showIntervenorRole', () => {
    it('should be true when there are no intervenors on the case', () => {
      const { showIntervenorRole } = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            petitioners: [mockPetitioner],
          },
        },
      });

      expect(showIntervenorRole).toBeTruthy();
    });

    it('should be false when there is an intervenor on the case', () => {
      const { showIntervenorRole } = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            petitioners: [
              mockPetitioner,
              { ...mockPetitioner, contactType: CONTACT_TYPES.intervenor },
            ],
          },
        },
      });

      expect(showIntervenorRole).toBeFalsy();
    });
  });
});
