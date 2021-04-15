const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const {
  getContactPrimary,
  getContactSecondary,
} = require('../../entities/cases/Case');
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
      birthYear: '1950',
      email: undefined,
      firstName: 'Alden',
      lastName: 'Rivas',
      name: 'Alden Rivas',
      pendingEmail: UPDATED_EMAIL,
      role: ROLES.petitioner,
      userId: USER_ID,
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

  it('should call updateUser with email set to pendingEmail and pendingEmail set to undefined', async () => {
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

  it('should update the user cases with the new email and electronic service for the contact primary', async () => {
    await setUserEmailFromPendingEmailInteractor({
      applicationContext,
      user: mockUser,
    });

    const {
      caseToUpdate,
    } = applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock.calls[0][0];

    expect(applicationContext.logger.error).not.toBeCalled();
    expect(getContactPrimary(caseToUpdate)).toMatchObject({
      email: UPDATED_EMAIL,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });
  });

  it('should update the user cases with the new email and electronic service for the contact secondary', async () => {
    userCases = [
      {
        ...MOCK_CASE,
        docketNumber: '101-21',
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
          {
            ...getContactPrimary(MOCK_CASE),
            contactId: USER_ID,
            contactType: CONTACT_TYPES.secondary,
            email: undefined,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
    ];

    mockUser.role = ROLES.petitioner;

    await setUserEmailFromPendingEmailInteractor({
      applicationContext,
      user: mockUser,
    });

    const {
      caseToUpdate,
    } = applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock.calls[0][0];

    expect(applicationContext.logger.error).not.toBeCalled();
    expect(getContactSecondary(caseToUpdate)).toMatchObject({
      email: UPDATED_EMAIL,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });
  });

  it('should throw an error when the user does not match the contactPrimary on the case', async () => {
    userCases = [
      {
        ...MOCK_CASE,
        docketNumber: '101-21',
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            email: undefined,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      },
    ];

    await setUserEmailFromPendingEmailInteractor({
      applicationContext,
      user: mockUser,
    });

    expect(applicationContext.logger.error.mock.calls[0][0]).toBe(
      `Could not find user|${USER_ID} on 101-21`,
    );
  });

  it('should continue updating other cases when one of the cases contact primary does not match the user', async () => {
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
      },
      {
        ...MOCK_CASE,
        docketNumber: '105-21',
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            email: undefined,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue([
        userCases[0].docketNumber,
        userCases[1].docketNumber,
      ]);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(userCases[0]);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(userCases[1]);

    await setUserEmailFromPendingEmailInteractor({
      applicationContext,
      user: mockUser,
    });

    const {
      caseToUpdate,
    } = applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock.calls[0][0];

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalledTimes(1);

    expect(getContactPrimary(caseToUpdate)).toMatchObject({
      email: UPDATED_EMAIL,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });
    expect(caseToUpdate).toMatchObject({
      docketNumber: '101-21',
    });
  });
});
