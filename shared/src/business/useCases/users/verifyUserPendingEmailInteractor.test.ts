import {
  CASE_STATUS_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_DOCUMENTS } from '../../../test/mockDocketEntry';
import { applicationContext } from '../../test/createTestApplicationContext';
import { calculateISODate } from '../../utilities/DateHandler';
import { getContactPrimary } from '../../entities/cases/Case';
import { validUser } from '../../../test/mockUsers';
import { verifyUserPendingEmailInteractor } from './verifyUserPendingEmailInteractor';

describe('verifyUserPendingEmailInteractor', () => {
  const TOKEN = '41189629-abe1-46d7-b7a4-9d3834f919cb';
  const mockPractitioner = {
    ...validUser,
    admissionsDate: '2019-03-01',
    admissionsStatus: 'Active',
    barNumber: 'RA3333',
    birthYear: '1950',
    email: 'test@example.com',
    employer: 'Private',
    firstName: 'Alden',
    lastName: 'Rivas',
    name: 'Alden Rivas',
    originalBarState: 'FL',
    pendingEmail: 'other@example.com',
    pendingEmailVerificationToken: TOKEN,
    practitionerType: 'Attorney',
    role: ROLES.privatePractitioner,
  };
  const mockPetitioner = {
    ...validUser,
    firstName: 'Olden',
    lastName: 'Vivas',
    pendingEmail: 'other@example.com',
    pendingEmailVerificationToken: TOKEN,
    role: ROLES.petitioner,
    userId: getContactPrimary(MOCK_CASE).contactId,
  };
  const mockCase = {
    ...MOCK_CASE,
    petitioners: [
      {
        ...getContactPrimary(MOCK_CASE),
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      },
    ],
    privatePractitioners: [mockPractitioner],
    status: CASE_STATUS_TYPES.generalDocket,
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(mockPractitioner);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(mockPractitioner);

    applicationContext
      .getPersistenceGateway()
      .isEmailAvailable.mockReturnValue(true);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue([mockCase.docketNumber]);
  });

  it('should throw unauthorized error when user does not have permission to verify emails', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });

    await expect(
      verifyUserPendingEmailInteractor(applicationContext, {
        token: 'abc',
      }),
    ).rejects.toThrow('Unauthorized to manage emails');
  });

  it('should throw an unauthorized error when the token passed as an argument does not match stored token on user', async () => {
    await expect(
      verifyUserPendingEmailInteractor(applicationContext, {
        token: 'abc',
      }),
    ).rejects.toThrow('Tokens do not match');
  });

  it('should throw an unauthorized error when the token passed as an argument and the token store on the user are both undefined', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...mockPractitioner,
      pendingEmailVerificationToken: undefined,
    });

    await expect(
      verifyUserPendingEmailInteractor(applicationContext, {
        token: undefined,
      }),
    ).rejects.toThrow('Tokens do not match');
  });

  it('should throw an error when the pendingEmail address is not available in cognito', async () => {
    applicationContext
      .getPersistenceGateway()
      .isEmailAvailable.mockReturnValue(false);

    await expect(
      verifyUserPendingEmailInteractor(applicationContext, {
        token: TOKEN,
      }),
    ).rejects.toThrow('Email is not available');
  });

  it('should update the cognito email when tokens match', async () => {
    await verifyUserPendingEmailInteractor(applicationContext, {
      token: TOKEN,
    });

    expect(
      applicationContext.getPersistenceGateway().updateUserEmail.mock
        .calls[0][0].user,
    ).toMatchObject({
      email: 'test@example.com',
      pendingEmailVerificationToken: TOKEN,
    });
  });

  it('should update the dynamo record with the new info', async () => {
    await verifyUserPendingEmailInteractor(applicationContext, {
      token: TOKEN,
    });

    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
        .user,
    ).toMatchObject({
      email: 'other@example.com',
      pendingEmail: undefined,
      pendingEmailVerificationToken: undefined,
    });
  });

  it('should log an error when the practitioner is not found on one of their associated cases by userId', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...mockCase,
        privatePractitioners: [],
      });

    await verifyUserPendingEmailInteractor(applicationContext, {
      token: TOKEN,
    });

    expect(applicationContext.logger.error.mock.calls[0][0]).toEqual(
      'Could not find user|3ab77c88-1dd0-4adb-a03c-c466ad72d417 barNumber: RA3333 on 101-18',
    );
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).not.toHaveBeenCalled();
  });

  it('should log an error when the petitioner is not found on one of their cases by userId', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...mockPetitioner,
      userId: 'cde00f40-56e8-46c2-94c3-b1155b89a203',
    });

    await verifyUserPendingEmailInteractor(applicationContext, {
      token: TOKEN,
    });

    expect(applicationContext.logger.error.mock.calls[0][0]).toEqual(
      'Could not find user|cde00f40-56e8-46c2-94c3-b1155b89a203 on 101-18',
    );
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).not.toHaveBeenCalled();
  });

  describe('update cases', () => {
    beforeEach(() => {
      const multipleUserCases = [
        {
          ...mockCase,
          docketNumber: '102-18',
        },
        {
          ...mockCase,
        },
      ];

      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockImplementation(({ docketNumber }) =>
          multipleUserCases.find(c => c.docketNumber === docketNumber),
        );

      applicationContext
        .getPersistenceGateway()
        .getDocketNumbersByUser.mockReturnValue(
          multipleUserCases.map(c => c.docketNumber),
        );
    });

    it("should update all of the user's cases with the new email", async () => {
      await verifyUserPendingEmailInteractor(applicationContext, {
        token: TOKEN,
      });

      expect(
        applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
          .calls.length,
      ).toEqual(2);
      expect(
        applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
          .calls[0][0].caseToUpdate,
      ).toMatchObject({
        privatePractitioners: [{ email: 'other@example.com' }],
      });
      expect(
        applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
          .calls[1][0].caseToUpdate,
      ).toMatchObject({
        privatePractitioners: [{ email: 'other@example.com' }],
      });
    });

    it('should notify the user as each of their cases is updated with the new email', async () => {
      await verifyUserPendingEmailInteractor(applicationContext, {
        token: TOKEN,
      });

      expect(
        applicationContext.getNotificationGateway().sendNotificationToUser.mock
          .calls[0][0].message,
      ).toMatchObject({
        action: 'user_contact_update_progress',
        completedCases: 1,
        totalCases: 2,
      });
      expect(
        applicationContext.getNotificationGateway().sendNotificationToUser.mock
          .calls[1][0].message,
      ).toMatchObject({
        action: 'user_contact_update_progress',
        completedCases: 2,
        totalCases: 2,
      });
    });

    it('should notify the user when their email has been verified and updating all their cases has completed', async () => {
      await verifyUserPendingEmailInteractor(applicationContext, {
        token: TOKEN,
      });

      expect(
        applicationContext.getNotificationGateway().sendNotificationToUser.mock
          .calls[2][0].message,
      ).toMatchObject({
        action: 'user_contact_full_update_complete',
        user: {
          email: 'other@example.com',
          userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
        },
      });
    });

    it('should not send any user notifications if the call to updateCase fails', async () => {
      applicationContext
        .getUseCaseHelpers()
        .updateCaseAndAssociations.mockRejectedValueOnce(
          new Error('updateCaseAndAssociations failure'),
        );

      await expect(
        verifyUserPendingEmailInteractor(applicationContext, {
          token: TOKEN,
        }),
      ).rejects.toThrow('updateCaseAndAssociations failure');

      expect(
        applicationContext.getNotificationGateway().sendNotificationToUser,
      ).not.toHaveBeenCalled();
    });
  });

  describe('generating a docket entry for petitioners', () => {
    beforeEach(() => {
      applicationContext
        .getUseCaseHelpers()
        .generateAndServeDocketEntry.mockReturnValue({
          changeOfAddressDocketEntry: {
            ...MOCK_DOCUMENTS[0],
            entityName: 'DocketEntry',
          },
        });

      applicationContext
        .getPersistenceGateway()
        .getUserById.mockReturnValue(mockPetitioner);
    });

    it('should call generateAndServeDocketEntry if case is open', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCase);

      await expect(
        verifyUserPendingEmailInteractor(applicationContext, {
          token: TOKEN,
        }),
      ).resolves.toBeUndefined(); // has no return value

      expect(
        applicationContext.getUseCaseHelpers().generateAndServeDocketEntry,
      ).toHaveBeenCalled();
    });

    it('should call generateAndServeDocketEntry if case was closed recently', async () => {
      const closedDate = calculateISODate({
        howMuch: -3,
        units: 'months',
      });
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...mockCase,
          closedDate,
          status: CASE_STATUS_TYPES.closed,
        });

      await expect(
        verifyUserPendingEmailInteractor(applicationContext, {
          token: TOKEN,
        }),
      ).resolves.toBeUndefined(); // has no return value

      expect(
        applicationContext.getUseCaseHelpers().generateAndServeDocketEntry,
      ).toHaveBeenCalled();
    });

    it('should not call generateAndServeDocketEntry if case has been closed longer than six months', async () => {
      const closedDate = calculateISODate({
        howMuch: -7,
        units: 'months',
      });

      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...MOCK_CASE,
          closedDate,
          status: CASE_STATUS_TYPES.closed,
        });

      await expect(
        verifyUserPendingEmailInteractor(applicationContext, {
          token: TOKEN,
        }),
      ).resolves.toBeUndefined(); // has no return value

      expect(
        applicationContext.getUseCaseHelpers().generateAndServeDocketEntry,
      ).not.toHaveBeenCalled();
    });

    describe('updatePetitionerCases', () => {
      it('should call generateAndServeDocketEntry with verified petitioner for servedParties', async () => {
        applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber.mockReturnValue({
            ...mockCase,
            privatePractitioners: [],
          });

        await verifyUserPendingEmailInteractor(applicationContext, {
          token: TOKEN,
        });

        const { servedParties } =
          applicationContext.getUseCaseHelpers().generateAndServeDocketEntry
            .mock.calls[0][0];
        expect(servedParties.electronic).toEqual([
          { email: 'other@example.com', name: 'Test Petitioner' },
        ]);
      });
    });
  });
});
