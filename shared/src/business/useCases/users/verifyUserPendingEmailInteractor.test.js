const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  verifyUserPendingEmailInteractor,
} = require('./verifyUserPendingEmailInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { ROLES } = require('../../entities/EntityConstants');
const { validUser } = require('../../../test/mockUsers');

describe('verifyUserPendingEmailInteractor', () => {
  let mockUser;
  const TOKEN = '41189629-abe1-46d7-b7a4-9d3834f919cb';

  beforeEach(() => {
    mockUser = {
      ...validUser,
      admissionsDate: '2019-03-01T21:40:46.415Z',
      admissionsStatus: 'Active',
      barNumber: 'RA3333',
      birthYear: '1950',
      employer: 'Private',
      firstName: 'Alden',
      lastName: 'Rivas',
      name: 'Alden Rivas',
      originalBarState: 'Florida',
      practitionerType: 'Attorney',
      role: ROLES.privatePractitioner,
    };

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
      .getCasesByUserId.mockReturnValue([]);
  });

  it('should throw unauthorized error when user does not have permission to verify emails', async () => {
    mockUser = {
      role: ROLES.petitionsClerk,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    };

    await expect(
      verifyUserPendingEmailInteractor({
        applicationContext,
        token: 'abc',
      }),
    ).rejects.toThrow('Unauthorized to manage emails');
  });

  it('should throw an unauthorized if the token passed as an argument does not match stored token on user', async () => {
    mockUser = {
      ...mockUser,
      pendingEmailVerificationToken: '123',
    };

    await expect(
      verifyUserPendingEmailInteractor({
        applicationContext,
        token: 'abc',
      }),
    ).rejects.toThrow('Tokens do not match');
  });

  it('should throw an unauthorized if the token passed as an argument and the token store on the user are both undefined', async () => {
    mockUser = {
      ...mockUser,
      pendingEmailVerificationToken: undefined,
    };
    await expect(
      verifyUserPendingEmailInteractor({
        applicationContext,
        token: undefined,
      }),
    ).rejects.toThrow('Tokens do not match');
  });

  it('should update the cognito email if tokens match', async () => {
    mockUser = {
      ...mockUser,
      email: 'test@example.com',
      pendingEmail: 'other@example.com',
      pendingEmailVerificationToken: TOKEN,
    };

    await verifyUserPendingEmailInteractor({
      applicationContext,
      token: TOKEN,
    });

    expect(
      applicationContext.getPersistenceGateway().updateUserEmail,
    ).toHaveBeenCalled();

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
    };

    await verifyUserPendingEmailInteractor({
      applicationContext,
      token: TOKEN,
    });

    expect(
      applicationContext.getPersistenceGateway().updateUser,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
        .user,
    ).toMatchObject({
      email: 'other@example.com',
      pendingEmail: undefined,
      pendingEmailVerificationToken: undefined,
    });
  });

  it('should log an error if the practitioner is not found on one of their associated cases by userId', async () => {
    const userCases = [
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
      .getCasesByUserId.mockReturnValue(userCases);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(userCases[0]);

    mockUser = {
      ...mockUser,
      email: 'test@example.com',
      pendingEmail: 'other@example.com',
      pendingEmailVerificationToken: TOKEN,
    };

    await verifyUserPendingEmailInteractor({
      applicationContext,
      token: TOKEN,
    });

    expect(applicationContext.logger.error.mock.calls[0][0]).toEqual(
      new Error(
        'Could not find user|3ab77c88-1dd0-4adb-a03c-c466ad72d417 barNumber: RA3333 on 101-21',
      ),
    );
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).not.toBeCalled();
  });

  it("should update all of the user's cases with the new email", async () => {
    const userCases = [
      {
        ...MOCK_CASE,
        docketNumber: '101-21',
        privatePractitioners: [{ ...mockUser, email: 'test@example.com' }],
      },
      {
        ...MOCK_CASE,
        docketNumber: '102-21',
        privatePractitioners: [{ ...mockUser, email: 'test@example.com' }],
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getCasesByUserId.mockReturnValue(userCases);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(userCases[0])
      .mockReturnValueOnce(userCases[1]);

    mockUser = {
      ...mockUser,
      email: 'test@example.com',
      pendingEmail: 'other@example.com',
      pendingEmailVerificationToken: TOKEN,
    };

    await verifyUserPendingEmailInteractor({
      applicationContext,
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
});
