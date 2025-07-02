import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import {
  CONTACT_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { MOCK_CASE } from '@shared/test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  deleteCounselFromCaseInteractor,
  setupServiceIndicatorForUnrepresentedPetitioners,
} from './deleteCounselFromCaseInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { disassociateUserFromCase as deleteUserFromCaseMock } from '@web-api/persistence/postgres/users/cases/disassociateUserFromCase';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';

describe('deleteCounselFromCaseInteractor', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const getUserById = getUserByIdMock as jest.Mock;
  const deleteUserFromCase = deleteUserFromCaseMock as jest.Mock;
  const updateCaseAndAssociations = jest
    .mocked(updateCaseAndAssociationsMock)
    .mockImplementation(({ caseToUpdate }) => Promise.resolve(caseToUpdate));
  const tryGetLocks = jest.mocked(tryGetLocksMock);

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
    getUserById.mockImplementation(({ userId }) => {
      const allUsers = [
        ...mockPrivatePractitioners,
        ...mockIrsPractitioners,
        ...mockPetitioners,
      ];
      return allUsers.find(user => user.userId === userId);
    });

    getCaseByDocketNumber.mockImplementation(({ docketNumber }) => ({
      ...MOCK_CASE,
      docketNumber,
      irsPractitioners: mockIrsPractitioners,
      privatePractitioners: mockPrivatePractitioners,
    }));
  });

  it('should return an unauthorized error when the user does not have permission to remove counsel from a case', async () => {
    await expect(
      deleteCounselFromCaseInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
          userId: '141d4c7c-4302-465d-89bd-3bc8ae16f07d',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw a ServiceUnavailableError when the case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

    await expect(
      deleteCounselFromCaseInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
          userId: '141d4c7c-4302-465d-89bd-3bc8ae16f07d',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the case', async () => {
    await deleteCounselFromCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        userId: '141d4c7c-4302-465d-89bd-3bc8ae16f07d',
      },
      mockDocketClerkUser,
    );

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      }),
    );
  });

  it('should remove the private practitioner with the given user id from the case', async () => {
    await deleteCounselFromCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        userId: '141d4c7c-4302-465d-89bd-3bc8ae16f07d',
      },
      mockDocketClerkUser,
    );

    expect(deleteUserFromCase).toHaveBeenCalled();
    expect(updateCaseAndAssociations).toHaveBeenCalled();
  });

  it('should remove the irs practitioner with the given userId from the case', async () => {
    await deleteCounselFromCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        userId: 'bfd97089-cda0-45e0-8454-dd879023d0af',
      },
      mockDocketClerkUser,
    );

    expect(deleteUserFromCase).toHaveBeenCalled();
    expect(updateCaseAndAssociations).toHaveBeenCalled();
  });

  it('should throw an error when the user is NOT a private practitioner or irs practitioner', async () => {
    await expect(
      deleteCounselFromCaseInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
          userId: '835f072c-5ea1-493c-acb8-d67b05c96f85',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('User is not a practitioner');
  });

  it('should set the contactPrimary.serviceIndicator to Electronic when the case was e-filed', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      petitioners: [
        {
          ...MOCK_CASE.petitioners[0],
          serviceIndicator: 'None',
        },
      ],
      privatePractitioners: [mockPrivatePractitioners[0]],
    });

    await deleteCounselFromCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        userId: mockPrivatePractitioners[0].userId,
      },
      mockDocketClerkUser,
    );

    const updatedCase = updateCaseAndAssociations.mock.calls[0][0].caseToUpdate;
    expect(updatedCase.petitioners[0].serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });

  it('should set the contactPrimary.serviceIndicator to electronic when the contactPrimary has an email', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        isPaper: true,
        mailingDate: '04/16/2019',
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            email: 'test@example.com',
            serviceIndicator: 'None',
          },
        ],
        privatePractitioners: [mockPrivatePractitioners[0]],
      });

    await deleteCounselFromCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        userId: mockPrivatePractitioners[0].userId,
      },
      mockDocketClerkUser,
    );

    const updatedCase = updateCaseAndAssociations.mock.calls[0][0].caseToUpdate;
    expect(updatedCase.petitioners[0].serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });

  it('should set the contactSecondary.serviceIndicator to paper when the case was paper-filed and the contactSecondary has no email', async () => {
    const caseToReturn = {
      ...MOCK_CASE,
      associatedJudge: 'Buch',
      associatedJudgeId: 'dabbad02-18d0-43ec-bafb-654e83405416',
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
          email: undefined,
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
    getCaseByDocketNumber.mockResolvedValue(caseToReturn);
    updateCaseAndAssociations.mockImplementation(
      ({ caseToUpdate }) => caseToUpdate,
    );

    await deleteCounselFromCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        userId: mockPrivatePractitioners[0].userId,
      },
      mockDocketClerkUser,
    );

    const updatedCase = updateCaseAndAssociations.mock.calls[0][0].caseToUpdate;
    expect(updatedCase.petitioners[1].serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );
  });

  it('should set the contactSecondary.serviceIndicator to electronic when the contactSecondary has an email and is no longer being represented', async () => {
    const caseToReturn = {
      ...MOCK_CASE,
      associatedJudge: 'Buch',
      associatedJudgeId: 'dabbad02-18d0-43ec-bafb-654e83405416',
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
          representing: ['7805d1ab-18d0-43ec-bafb-654e83405416'],
        },
      ],
    };
    getCaseByDocketNumber.mockResolvedValue(caseToReturn);
    updateCaseAndAssociations.mockImplementation(
      ({ caseToUpdate }) => caseToUpdate,
    );

    await deleteCounselFromCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        userId: mockPrivatePractitioners[0].userId,
      },
      mockDocketClerkUser,
    );

    const updatedCase = updateCaseAndAssociations.mock.calls[0][0].caseToUpdate;
    expect(updatedCase.petitioners[1].serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });

  describe('setupServiceIndicatorForUnrepresentedPetitioners', () => {
    it("should set the petitioner's serviceIndicator to null when the petitioner is not represented", () => {
      const mockCase = {
        ...MOCK_CASE,
        associatedJudge: 'Buch',
        associatedJudgeId: 'dabbad02-18d0-43ec-bafb-654e83405416',
        mailingDate: '04/16/2019',
        partyType: 'Petitioner',
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            serviceIndicator: 'Test',
          },
        ],
        privatePractitioners: [],
      };

      const result = setupServiceIndicatorForUnrepresentedPetitioners(
        new Case(mockCase, { authorizedUser: mockDocketClerkUser }),
      );

      expect(result.petitioners[0].serviceIndicator).toBeUndefined();
    });

    it("should NOT change the petitioner's serviceIndicator when the peitioner is represented", () => {
      const mockCase = {
        ...MOCK_CASE,
        associatedJudge: 'Buch',
        associatedJudgeId: 'dabbad02-18d0-43ec-bafb-654e83405416',
        mailingDate: '04/16/2019',
        partyType: 'Petitioner',
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          },
        ],
        privatePractitioners: [
          {
            ...mockPrivatePractitioners[0],
            representing: [MOCK_CASE.petitioners[0].contactId],
          },
        ],
      };

      const result = setupServiceIndicatorForUnrepresentedPetitioners(
        new Case(mockCase, { authorizedUser: mockDocketClerkUser }),
      );

      expect(result.petitioners[0].serviceIndicator).toEqual(
        SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      );
    });
  });
});
