const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  deleteCounselFromCaseInteractor,
} = require('./deleteCounselFromCaseInteractor');
const {
  getContactPrimary,
  getContactSecondary,
} = require('../../entities/cases/Case');
const { CONTACT_TYPES, ROLES } = require('../../entities/EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase.js');

describe('deleteCounselFromCaseInteractor', () => {
  const mockPrivatePractitioners = [
    {
      barNumber: 'BN1234',
      name: 'Saul Goodman',
      role: ROLES.privatePractitioner,
      userId: '02f8a9cf-3bc8-4c91-a765-2f19013cd004',
    },
    {
      barNumber: 'BN2345',
      name: 'Saul Goodman',
      role: ROLES.privatePractitioner,
      userId: '141d4c7c-4302-465d-89bd-3bc8ae16f07d',
    },
    {
      barNumber: 'BN3456',
      name: 'Saul Goodman',
      role: ROLES.privatePractitioner,
      userId: '6de95584-fbf2-42d7-bd81-bf9e10633404',
    },
  ];

  const mockIrsPractitioners = [
    {
      barNumber: 'BN9876',
      name: 'Saul Goodman',
      role: ROLES.irsPractitioner,
      userId: '547f2148-3bb8-408b-bbaa-40d53f14f924',
    },
    {
      barNumber: 'BN8765',
      name: 'Saul Goodman',
      role: ROLES.irsPractitioner,
      userId: 'bfd97089-cda0-45e0-8454-dd879023d0af',
    },
    {
      barNumber: 'BN7654',
      name: 'Saul Goodman',
      role: ROLES.irsPractitioner,
      userId: '55c50d5d-b2eb-466e-9775-d0e1b464472d',
    },
  ];

  const mockPetitioners = [
    {
      role: ROLES.petitioner,
      userId: '835f072c-5ea1-493c-acb8-d67b05c96f85',
    },
  ];

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'fb39f224-7985-438d-8327-2df162c20c8e',
    });

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(({ userId }) => {
        return mockPrivatePractitioners
          .concat(mockIrsPractitioners)
          .concat(mockPetitioners)
          .find(user => user.userId === userId);
      });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => ({
        ...MOCK_CASE,
        docketNumber,
        irsPractitioners: mockIrsPractitioners,
        privatePractitioners: mockPrivatePractitioners,
      }));

    applicationContext
      .getPersistenceGateway()
      .getFullCaseByDocketNumber.mockImplementation(({ docketNumber }) => ({
        ...MOCK_CASE,
        docketNumber,
        irsPractitioners: mockIrsPractitioners,
        privatePractitioners: mockPrivatePractitioners,
      }));
  });

  it('returns an unauthorized error for a petitioner user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
    });

    await expect(
      deleteCounselFromCaseInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        userId: '141d4c7c-4302-465d-89bd-3bc8ae16f07d',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('deletes a practitioner with the given userId from the associated case', async () => {
    await deleteCounselFromCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      userId: '141d4c7c-4302-465d-89bd-3bc8ae16f07d',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().deleteUserFromCase,
    ).toHaveBeenCalled();
  });

  it('deletes an irsPractitioner with the given userId from the associated case', async () => {
    await deleteCounselFromCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      userId: 'bfd97089-cda0-45e0-8454-dd879023d0af',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().deleteUserFromCase,
    ).toHaveBeenCalled();
  });

  it('throws an error if the userId is not a privatePractitioner or irsPractitioner role', async () => {
    await expect(
      deleteCounselFromCaseInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        userId: '835f072c-5ea1-493c-acb8-d67b05c96f85',
      }),
    ).rejects.toThrow('User is not a practitioner');
  });

  it('should set the contactPrimary.serviceIndicator to Electronic if the case was e-filed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            serviceIndicator: 'None',
          },
        ],
        privatePractitioners: [mockPrivatePractitioners[0]],
      });

    const updatedCase = await deleteCounselFromCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        userId: mockPrivatePractitioners[0].userId,
      },
    );

    expect(getContactPrimary(updatedCase).serviceIndicator).toEqual(
      'Electronic',
    );
  });

  it('should set the contactPrimary.serviceIndicator to Paper if the case was paper', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        contactPrimary: {
          ...MOCK_CASE.contactPrimary,
          serviceIndicator: 'None',
        },
        isPaper: true,
        mailingDate: '04/16/2019',
        privatePractitioners: [mockPrivatePractitioners[0]],
      });

    const updatedCase = await deleteCounselFromCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        userId: mockPrivatePractitioners[0].userId,
      },
    );

    expect(getContactPrimary(updatedCase).serviceIndicator).toEqual('Paper');
  });

  it('should set the contactSecondary.serviceIndicator to Paper if the case was paper', async () => {
    const caseToReturn = {
      ...MOCK_CASE,
      associatedJudge: 'Buch',
      mailingDate: '04/16/2019',
      partyType: 'Petitioner & spouse',
      petitioners: [
        {
          ...MOCK_CASE.petitioners[0],
          serviceIndicator: 'None',
        },
        {
          address1: '123 Main St',
          city: 'Somewhere',
          contactId: '3805d1ab-18d0-43ec-bafb-654e83405416',
          contactType: CONTACT_TYPES.secondary,
          countryType: 'domestic',
          email: 'petitioner@example.com',
          name: 'Test Petitioner',
          phone: '1234567',
          postalCode: '12345',
          serviceIndicator: 'None',
          state: 'TN',
          title: 'Executor',
        },
      ],
      privatePractitioners: [
        {
          ...mockPrivatePractitioners[0],
          representing: [
            '3805d1ab-18d0-43ec-bafb-654e83405416',
            '7805d1ab-18d0-43ec-bafb-654e83405416',
          ],
        },
      ],
    };
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseToReturn);

    applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mockImplementation(
        ({ caseToUpdate }) => caseToUpdate,
      );

    const updatedCase = await deleteCounselFromCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        userId: mockPrivatePractitioners[0].userId,
      },
    );
    expect(getContactSecondary(updatedCase).serviceIndicator).toEqual('Paper');
  });
});
