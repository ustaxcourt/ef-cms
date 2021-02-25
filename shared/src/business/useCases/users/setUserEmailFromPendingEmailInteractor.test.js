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
const { MOCK_CASE } = require('../../../test/mockCase');
const { validUser } = require('../../../test/mockUsers');

describe('setUserEmailFromPendingEmailInteractor', () => {
  let mockUser;
  let userCases;
  const UPDATED_EMAIL = 'other@example.com';
  const USER_ID = '7a0c9454-5f1a-438a-8c8a-f7560b119343';

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
      originalBarState: 'Florida',
      practitionerType: 'Attorney',
      role: ROLES.privatePractitioner,
      userId: USER_ID,
    };

    applicationContext
      .getPersistenceGateway()
      .updateUser.mockImplementation(() => mockUser);
  });

  it('should call updateUser with email set to pendingEmail and pendingEmail set to undefined', async () => {
    mockUser = {
      ...mockUser,
      email: undefined,
      pendingEmail: UPDATED_EMAIL,
    };

    await setUserEmailFromPendingEmailInteractor({
      applicationContext,
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

  it('should update the user cases with the new email and electronic service', async () => {
    mockUser = {
      ...mockUser,
      email: undefined,
      pendingEmail: UPDATED_EMAIL,
    };

    userCases = [
      {
        ...MOCK_CASE,
        contactPrimary: [
          {
            ...MOCK_CASE.contactPrimary,
            contactId: USER_ID,
            email: undefined,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
        docketNumber: '101-21',
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue([userCases[0].docketNumber]);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(userCases[0]);

    await setUserEmailFromPendingEmailInteractor({
      applicationContext,
      user: mockUser,
    });

    expect(applicationContext.logger.error).not.toBeCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate,
    ).toMatchObject({
      contactPrimary: {
        email: UPDATED_EMAIL,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
    });
  });
});
