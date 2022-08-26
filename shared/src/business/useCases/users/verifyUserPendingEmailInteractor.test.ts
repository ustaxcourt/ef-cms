const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const {
  updatePetitionerCases,
  verifyUserPendingEmailInteractor,
} = require('./verifyUserPendingEmailInteractor');
const { calculateISODate } = require('../../utilities/DateHandler');
const { getContactPrimary } = require('../../entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_DOCUMENTS } = require('../../../test/mockDocuments');
const { validUser } = require('../../../test/mockUsers');

describe('verifyUserPendingEmailInteractor', () => {
  let mockUser;
  let userCases;

  const TOKEN = '41189629-abe1-46d7-b7a4-9d3834f919cb';

  beforeEach(() => {
    mockUser = {
      ...validUser,
      admissionsDate: '2019-03-01',
      admissionsStatus: 'Active',
      barNumber: 'RA3333',
      birthYear: '1950',
      employer: 'Private',
      firstName: 'Alden',
      lastName: 'Rivas',
      name: 'Alden Rivas',
      originalBarState: 'FL',
      practitionerType: 'Attorney',
      role: ROLES.privatePractitioner,
    };

    userCases = [
      {
        ...MOCK_CASE,
        docketNumber: '101-21',
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactId: mockUser.userId,
            email: undefined,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
        privatePractitioners: [mockUser],
      },
    ];

    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => mockUser);

    applicationContext
      .getPersistenceGateway()
      .updateUser.mockImplementation(() => mockUser);

    applicationContext
      .getPersistenceGateway()
      .updateUserEmail.mockImplementation(() => mockUser);

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockImplementation(() => {
        return userCases.map(c => c.docketNumber);
      });

    applicationContext
      .getPersistenceGateway()
      .isEmailAvailable.mockReturnValue(true);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
  });

  it('should throw unauthorized error when user does not have permission to verify emails', async () => {
    mockUser = {
      role: ROLES.petitionsClerk,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    };

    await expect(
      verifyUserPendingEmailInteractor(applicationContext, {
        token: 'abc',
      }),
    ).rejects.toThrow('Unauthorized to manage emails');
  });

  it('should throw an unauthorized error when the token passed as an argument does not match stored token on user', async () => {
    mockUser = {
      ...mockUser,
      pendingEmailVerificationToken: '123',
    };

    await expect(
      verifyUserPendingEmailInteractor(applicationContext, {
        token: 'abc',
      }),
    ).rejects.toThrow('Tokens do not match');
  });

  it('should throw an unauthorized error when the token passed as an argument and the token store on the user are both undefined', async () => {
    mockUser = {
      ...mockUser,
      pendingEmailVerificationToken: undefined,
    };

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
    mockUser = {
      ...mockUser,
      email: 'test@example.com',
      pendingEmail: 'other@example.com',
      pendingEmailVerificationToken: TOKEN,
    };

    await expect(
      verifyUserPendingEmailInteractor(applicationContext, {
        token: TOKEN,
      }),
    ).rejects.toThrow('Email is not available');
  });

  it('should update the cognito email when tokens match', async () => {
    mockUser = {
      ...mockUser,
      email: 'test@example.com',
      pendingEmail: 'other@example.com',
      pendingEmailVerificationToken: TOKEN,
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        privatePractitioners: [mockUser],
      });

    await verifyUserPendingEmailInteractor(applicationContext, {
      token: TOKEN,
    });

    expect(
      applicationContext.getPersistenceGateway().updateUserEmail.mock
        .calls[0][0].user,
    ).toMatchObject({
      email: 'test@example.com',
      pendingEmail: 'other@example.com',
      pendingEmailVerificationToken: TOKEN,
    });
  });

  it('should update the dynamo record with the new info', async () => {
    mockUser = {
      ...mockUser,
      email: 'test@example.com',
      pendingEmail: 'other@example.com',
      pendingEmailVerificationToken: TOKEN,
      userId: '0e363902-598e-4db3-bb41-68bdea9f9154',
    };

    userCases = [
      {
        ...MOCK_CASE,
        docketNumber: '101-21',
        privatePractitioners: [
          {
            ...mockUser,
            email: 'test@example.com',
            userId: '0e363902-598e-4db3-bb41-68bdea9f9154',
          },
        ],
      },
    ];
    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue([userCases[0].docketNumber]);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(userCases[0]);

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
    mockUser = {
      ...mockUser,
      email: 'test@example.com',
      pendingEmail: 'other@example.com',
      pendingEmailVerificationToken: TOKEN,
    };
    userCases = [
      {
        ...MOCK_CASE,
        docketNumber: '101-21',
        privatePractitioners: [
          {
            ...mockUser,
            email: 'test@example.com',
            userId: '0e363902-598e-4db3-bb41-68bdea9f9154',
          },
        ],
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(userCases[0]);

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockImplementation(() => {
        return userCases.map(c => c.docketNumber);
      });

    await verifyUserPendingEmailInteractor(applicationContext, {
      token: TOKEN,
    });

    expect(applicationContext.logger.error.mock.calls[0][0]).toEqual(
      'Could not find user|3ab77c88-1dd0-4adb-a03c-c466ad72d417 barNumber: RA3333 on 101-21',
    );
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).not.toBeCalled();
  });

  it('should log an error when the petitioner is not found on one of their cases by userId', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockReturnValueOnce({
      ...getContactPrimary(MOCK_CASE),
      email: 'test@example.com',
      pendingEmail: 'other@example.com',
      pendingEmailVerificationToken: TOKEN,
      role: ROLES.petitioner,
      userId: 'cde00f40-56e8-46c2-94c3-b1155b89a203',
    });

    applicationContext
      .getPersistenceGateway()
      .getCasesForUser.mockReturnValueOnce([
        { docketNumber: MOCK_CASE.docketNumber },
      ]);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(userCases[0]);

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockImplementationOnce(() => {
        return userCases.map(c => c.docketNumber);
      });

    await verifyUserPendingEmailInteractor(applicationContext, {
      token: TOKEN,
    });

    expect(applicationContext.logger.error.mock.calls[0][0]).toEqual(
      'Could not find user|cde00f40-56e8-46c2-94c3-b1155b89a203 on 101-21',
    );
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).not.toBeCalled();
  });

  describe('update cases', () => {
    beforeEach(() => {
      userCases = [
        {
          ...MOCK_CASE,
          docketNumber: '101-21',
          privatePractitioners: [{ ...mockUser, email: 'test@example.com' }],
        },
        {
          ...MOCK_CASE,
          privatePractitioners: [{ ...mockUser, email: 'test@example.com' }],
        },
      ];

      mockUser = {
        ...mockUser,
        email: 'test@example.com',
        pendingEmail: 'other@example.com',
        pendingEmailVerificationToken: TOKEN,
      };

      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValueOnce(userCases[0])
        .mockReturnValueOnce(userCases[1]);
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

  describe('generating a docket entry', () => {
    beforeAll(() => {
      applicationContext
        .getUseCaseHelpers()
        .generateAndServeDocketEntry.mockReturnValue({
          changeOfAddressDocketEntry: {
            ...MOCK_DOCUMENTS[0],
            entityName: 'DocketEntry',
            isMinuteEntry: 'false',
          },
        });
    });

    it('should call generateAndServeDocketEntry if case is open', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCasesForUser.mockReturnValue([
          { docketNumber: MOCK_CASE.docketNumber },
        ]);
      applicationContext
        .getPersistenceGateway()
        .getUserById.mockReturnValueOnce({
          ...validUser,
          pendingEmailVerificationToken: TOKEN,
          userId: MOCK_CASE.petitioners[0].contactId,
        });
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValueOnce({
          ...MOCK_CASE,
          status: CASE_STATUS_TYPES.generalDocket,
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

    it('should call generateAndServeDocketEntry if case was closed recently', async () => {
      const closedDate = calculateISODate({
        howMuch: -3,
        units: 'months',
      });
      applicationContext
        .getPersistenceGateway()
        .getCasesForUser.mockReturnValue([
          { docketNumber: MOCK_CASE.docketNumber },
        ]);
      applicationContext
        .getPersistenceGateway()
        .getUserById.mockReturnValueOnce({
          ...validUser,
          pendingEmailVerificationToken: TOKEN,
          userId: MOCK_CASE.petitioners[0].contactId,
        });
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValueOnce({
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
      ).toHaveBeenCalled();
    });

    it('should not call generateAndServeDocketEntry if case has been closed longer than six months', async () => {
      const closedDate = calculateISODate({
        howMuch: -7,
        units: 'months',
      });
      applicationContext
        .getPersistenceGateway()
        .getCasesForUser.mockReturnValue([
          { docketNumber: MOCK_CASE.docketNumber },
        ]);
      applicationContext
        .getPersistenceGateway()
        .getUserById.mockReturnValueOnce({
          ...validUser,
          pendingEmailVerificationToken: TOKEN,
          userId: MOCK_CASE.petitioners[0].contactId,
        });
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValueOnce({
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
          .getCasesForUser.mockReturnValue([
            { docketNumber: MOCK_CASE.docketNumber },
          ]);
        applicationContext
          .getPersistenceGateway()
          .getUserById.mockReturnValueOnce({
            ...validUser,
            pendingEmailVerificationToken: TOKEN,
            userId: MOCK_CASE.petitioners[0].contactId,
          });
        applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber.mockReturnValueOnce({
            ...MOCK_CASE,
            petitioners: [
              {
                ...MOCK_CASE.petitioners[0],
                serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
              },
            ],
            status: CASE_STATUS_TYPES.generalDocket,
          });

        await updatePetitionerCases({
          applicationContext,
          user: {
            email: 'test@example.com',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          },
        });

        const { servedParties } =
          applicationContext.getUseCaseHelpers().generateAndServeDocketEntry
            .mock.calls[0][0];
        expect(servedParties.electronic).toEqual([
          { email: 'test@example.com', name: 'Test Petitioner' },
        ]);
      });
    });
  });
});
