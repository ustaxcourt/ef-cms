const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const {
  setUserEmailFromPendingEmailInteractor,
} = require('./setUserEmailFromPendingEmailInteractor');
const { getContactPrimary } = require('../../entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_PRACTITIONER, validUser } = require('../../../test/mockUsers');

describe('setUserEmailFromPendingEmailInteractor', () => {
  let mockPractitioner;
  let mockUser;
  let userCases;
  const UPDATED_EMAIL = 'other@example.com';
  const USER_ID = '7a0c9454-5f1a-438a-8c8a-f7560b119343';

  beforeEach(() => {
    mockUser = {
      ...validUser,
      birthYear: '1950',
      email: undefined,
      firstName: 'Alden',
      lastName: 'Rivas',
      name: 'Alden Rivas',
      originalBarState: 'FL',
      pendingEmail: UPDATED_EMAIL,
      role: ROLES.petitioner,
      userId: USER_ID,
    };

    mockPractitioner = {
      ...MOCK_PRACTITIONER,
      email: undefined,
      pendingEmail: UPDATED_EMAIL,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    };

    userCases = [
      {
        ...MOCK_CASE,
        docketNumber: '101-21',
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactId: USER_ID,
            email: undefined,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
        privatePractitioners: [mockPractitioner],
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .updateUser.mockImplementation(() => mockUser);

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockImplementation(() => [
        userCases[0].docketNumber,
      ]);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => userCases[0]);
  });

  it('should call updateUser with email set to pendingEmail and pendingEmail set to undefined, and service indicator set to electronic with a practitioner user', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesByUserId.mockReturnValue(userCases);

    await setUserEmailFromPendingEmailInteractor(applicationContext, {
      user: {
        ...mockPractitioner,
        email: UPDATED_EMAIL,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
        .user,
    ).toMatchObject({
      email: UPDATED_EMAIL,
      entityName: 'Practitioner',
      pendingEmail: undefined,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });
  });

  it('should call updateUser with email set to pendingEmail and pendingEmail set to undefined', async () => {
    await setUserEmailFromPendingEmailInteractor(applicationContext, {
      user: mockUser,
    });

    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
        .user,
    ).toMatchObject({
      email: UPDATED_EMAIL,
      pendingEmail: undefined,
    });
  });

  it('should attempt to send a message to update the petitioner cases via the message gateway', async () => {
    await setUserEmailFromPendingEmailInteractor(applicationContext, {
      user: mockUser,
    });

    expect(
      applicationContext.getMessageGateway().sendUpdatePetitionerCasesMessage,
    ).toHaveBeenCalled();
  });

  it('should update the user cases with the new email and electronic service for a practitioner', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesByUserId.mockReturnValue(userCases);

    await setUserEmailFromPendingEmailInteractor(applicationContext, {
      user: mockPractitioner,
    });

    const { caseToUpdate } =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0];

    expect(applicationContext.logger.error).not.toBeCalled();
    expect(caseToUpdate.privatePractitioners[0]).toMatchObject({
      email: UPDATED_EMAIL,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });
  });

  it('should log an error when the user is not found on one of their associated cases by userId', async () => {
    const mockErrorMessage = 'updateCaseAndAssociations failure';

    applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mockRejectedValueOnce(
        new Error(mockErrorMessage),
      );

    await expect(
      setUserEmailFromPendingEmailInteractor(applicationContext, {
        user: mockPractitioner,
      }),
    ).rejects.toThrow(mockErrorMessage);
  });
});
