const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CONTACT_TYPES,
  PARTY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const {
  MOCK_CASE,
  MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
} = require('../../../test/mockCase');
const { updatePetitionerCases } = require('./verifyUserPendingEmailInteractor');
const { validUser } = require('../../../test/mockUsers');

describe('verifyUserPendingEmailInteractor updatePetitionerCases', () => {
  let mockPetitionerUser, userCases;
  const UPDATED_EMAIL = 'hello@example.com';

  beforeEach(() => {
    mockPetitionerUser = {
      ...validUser,
      email: UPDATED_EMAIL,
      role: ROLES.petitioner,
    };

    applicationContext
      .getPersistenceGateway()
      .getCasesForUser.mockReturnValue([]);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(undefined);
  });

  it('should call getCasesForUser with user.userId', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(undefined);
    await updatePetitionerCases({
      applicationContext,
      user: mockPetitionerUser,
    });

    expect(
      applicationContext.getPersistenceGateway().getCasesForUser.mock
        .calls[0][0],
    ).toMatchObject({
      userId: validUser.userId,
    });
  });

  it('should call getCaseByDocketNumber for each case returned by getCasesForUser', async () => {
    const casesMock = [
      {
        ...MOCK_CASE,
        docketNumber: '101-21',
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            contactId: mockPetitionerUser.userId,
          },
        ],
      },
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            contactId: mockPetitionerUser.userId,
          },
        ],
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getCasesForUser.mockResolvedValue(casesMock);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(casesMock[0]);

    await updatePetitionerCases({
      applicationContext,
      user: mockPetitionerUser,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0],
    ).toMatchObject({
      docketNumber: '101-21',
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[1][0],
    ).toMatchObject({
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalled();
  });

  it('should log an error if the petitioner is not found on a case returned by getCasesForUser and call updateCaseAndAssociations only once', async () => {
    userCases = [
      {
        ...MOCK_CASE,
        docketNumber: '101-21',
      },
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            contactId: mockPetitionerUser.userId,
          },
        ],
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getCasesForUser.mockReturnValue(userCases);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(userCases[0])
      .mockReturnValueOnce(userCases[1])
      .mockReturnValueOnce(MOCK_CASE);

    await expect(
      updatePetitionerCases({
        applicationContext,
        user: mockPetitionerUser,
      }),
    ).resolves.not.toThrow();

    expect(applicationContext.logger.error).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalledTimes(1);
  });

  it('should log an error if any case update is invalid and prevent updateCaseAndAssociations from being called', async () => {
    userCases = [
      {
        ...MOCK_CASE,
        docketNumber: 'not a docket number',
        invalidCase: 'yep',
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            contactId: mockPetitionerUser.userId,
          },
        ],
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getCasesForUser.mockReturnValueOnce(userCases);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(userCases[0]);

    await expect(
      updatePetitionerCases({
        applicationContext,
        user: mockPetitionerUser,
      }),
    ).rejects.toThrow('entity was invalid');

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).not.toHaveBeenCalled();
  });

  it('should call updateCaseAndAssociations with updated email address for a contactSecondary', async () => {
    userCases = [
      {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.petitionerDeceasedSpouse,
        petitioners: [
          ...MOCK_CASE.petitioners,
          {
            ...MOCK_CASE.petitioners[0],
            contactId: mockPetitionerUser.userId,
            contactType: CONTACT_TYPES.secondary,
            inCareOf: 'Barney',
          },
        ],
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getCasesForUser.mockReturnValue(userCases);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(userCases[0]);

    await updatePetitionerCases({
      applicationContext,
      user: mockPetitionerUser,
    });

    const { caseToUpdate } =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0];
    expect(caseToUpdate.petitioners[1].email).toBe(UPDATED_EMAIL);
    expect(caseToUpdate.docketNumber).toBe(MOCK_CASE.docketNumber);
  });

  it('should update the petitioner service indicator when they are not represented', async () => {
    userCases = [
      {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.petitionerDeceasedSpouse,
        petitioners: [
          ...MOCK_CASE.petitioners,
          {
            ...MOCK_CASE.petitioners[0],
            contactId: mockPetitionerUser.userId,
            contactType: CONTACT_TYPES.secondary,
            inCareOf: 'Barney',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
          },
        ],
        privatePractitioners: [
          {
            ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS.privatePractitioners[0],
            representing: [],
          },
        ],
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getCasesForUser.mockReturnValue(userCases);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(userCases[0]);

    await updatePetitionerCases({
      applicationContext,
      user: mockPetitionerUser,
    });

    const { caseToUpdate } =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0];

    expect(caseToUpdate.petitioners[1].serviceIndicator).toBe(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
    expect(caseToUpdate.docketNumber).toBe(MOCK_CASE.docketNumber);
  });

  it('should update the petitioner service indicator when they are not represented', async () => {
    userCases = [
      {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.petitionerDeceasedSpouse,
        petitioners: [
          ...MOCK_CASE.petitioners,
          {
            ...MOCK_CASE.petitioners[0],
            contactId: mockPetitionerUser.userId,
            contactType: CONTACT_TYPES.secondary,
            inCareOf: 'Barney',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
          },
        ],
        privatePractitioners: [
          {
            ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS.privatePractitioners[0],
            representing: [mockPetitionerUser.userId],
          },
        ],
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getCasesForUser.mockReturnValue(userCases);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(userCases[0]);

    await updatePetitionerCases({
      applicationContext,
      user: mockPetitionerUser,
    });

    const { caseToUpdate } =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0];

    expect(caseToUpdate.petitioners[1].serviceIndicator).toBe(
      SERVICE_INDICATOR_TYPES.SI_NONE,
    );
    expect(caseToUpdate.docketNumber).toBe(MOCK_CASE.docketNumber);
  });
});
