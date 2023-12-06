import {
  ALLOWLIST_FEATURE_FLAGS,
  CONTACT_TYPES,
  ROLES,
  UNIQUE_OTHER_FILER_TYPE,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  docketClerkUser,
  petitionerUser,
  petitionsClerkUser,
} from '../../../../shared/src/test/mockUsers';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { partiesInformationHelper as partiesInformationHelperComputed } from './partiesInformationHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
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
  let mockPetitioner;
  let mockPrivatePractitioner;
  let mockIrsPractitioner;
  let mockUser;

  const partiesInformationHelper = withAppContextDecorator(
    partiesInformationHelperComputed,
    applicationContext,
  );

  const getBaseState = user => {
    mockUser = { ...user };

    return {
      featureFlags: {
        [ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key]:
          true,
      },
      permissions: getUserPermissions(user),
      screenMetadata: { pendingEmails: {} },
    };
  };

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
      const mockPendingPractitionerEmail = 'pendingpractitioner@example.com';

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

      expect(
        result.formattedPetitioners[0].representingPractitioners,
      ).toMatchObject([
        {
          ...mockPrivatePractitioner,
          formattedEmail: mockEmail,
          representing: [mockPetitioner.contactId],
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

      expect(
        result.formattedPetitioners[0].representingPractitioners[0]
          .formattedEmail,
      ).toEqual('No email provided');
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

      expect(result.formattedPetitioners[0].hasCounsel).toEqual(false);
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

    it('should set formattedPaperPetitionEmail to "Not provided" when a paper petition email has not been provided for the petitioner', () => {
      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockPrivatePractitioner),
          caseDetail: {
            petitioners: [{ ...mockPetitioner, paperPetitionEmail: undefined }],
            privatePractitioners: [mockPrivatePractitioner],
          },
          screenMetadata: {
            pendingEmails: {
              [mockPetitioner.contactId]: true,
            },
          },
        },
      });

      expect(result.formattedPetitioners[0].formattedPaperPetitionEmail).toBe(
        'Not provided',
      );
    });

    it('should set formattedPaperPetitionEmail to the value of paper petition email when it has been provided for the petitioner', () => {
      const mockPaperPetitionEmail = 'mockUser@example.com';

      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(mockPrivatePractitioner),
          caseDetail: {
            petitioners: [
              { ...mockPetitioner, paperPetitionEmail: mockPaperPetitionEmail },
            ],
            privatePractitioners: [mockPrivatePractitioner],
          },
          screenMetadata: {
            pendingEmails: {
              [mockPetitioner.contactId]: true,
            },
          },
        },
      });

      expect(result.formattedPetitioners[0].formattedPaperPetitionEmail).toBe(
        mockPaperPetitionEmail,
      );
    });

    it('should set showPaperPetitionEmail flag to true when their contact info is not sealed and the user is an internal user', () => {
      const mockPaperPetitionEmail = 'mockUser@example.com';

      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            petitioners: [
              {
                ...mockPetitioner,
                paperPetitionEmail: mockPaperPetitionEmail,
                sealedAndUnavailable: false,
              },
            ],
            privatePractitioners: [mockPrivatePractitioner],
          },
          screenMetadata: {},
        },
      });

      expect(result.formattedPetitioners[0].showPaperPetitionEmail).toBe(true);
    });

    it('should set showPaperPetitionEmail flag to false when their contact info is sealed and the user is an internal user', () => {
      const mockPaperPetitionEmail = 'mockUser@example.com';

      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            petitioners: [
              {
                ...mockPetitioner,
                paperPetitionEmail: mockPaperPetitionEmail,
                sealedAndUnavailable: true,
              },
            ],
            privatePractitioners: [mockPrivatePractitioner],
          },
          screenMetadata: {},
        },
      });

      expect(result.formattedPetitioners[0].showPaperPetitionEmail).toBe(false);
    });

    it('should set showPaperPetitionEmail flag to false when their contact info is not sealed and the user is an external user', () => {
      const mockPaperPetitionEmail = 'mockUser@example.com';

      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(petitionerUser),
          caseDetail: {
            petitioners: [
              {
                ...mockPetitioner,
                paperPetitionEmail: mockPaperPetitionEmail,
                sealedAndUnavailable: false,
              },
            ],
            privatePractitioners: [mockPrivatePractitioner],
          },
          screenMetadata: {},
        },
      });

      expect(result.formattedPetitioners[0].showPaperPetitionEmail).toBe(false);
    });

    it('should not display paper petition email when the feature flag is off', () => {
      const mockPaperPetitionEmail = 'mockUser@example.com';

      const result = runCompute(partiesInformationHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            petitioners: [
              {
                ...mockPetitioner,
                paperPetitionEmail: mockPaperPetitionEmail,
                sealedAndUnavailable: false,
              },
            ],
          },
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key]:
              false,
          },
        },
      });

      expect(result.formattedPetitioners[0].showPaperPetitionEmail).toBe(false);
    });
  });

  describe('formattedRespondents', () => {
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
