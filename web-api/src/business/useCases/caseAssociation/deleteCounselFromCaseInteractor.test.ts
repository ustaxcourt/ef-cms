import {
  CONTACT_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { MOCK_LOCK } from '../../../../../shared/src/test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  deleteCounselFromCaseInteractor,
  setupServiceIndicatorForUnrepresentedPetitioners,
} from './deleteCounselFromCaseInteractor';
import { petitionerUser } from '@shared/test/mockUsers';

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

  let mockLock;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'fb39f224-7985-438d-8327-2df162c20c8e',
    });

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(({ userId }) => {
        const allUsers = [
          ...mockPrivatePractitioners,
          ...mockIrsPractitioners,
          ...mockPetitioners,
        ];
        return allUsers.find(user => user.userId === userId);
      });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => ({
        ...MOCK_CASE,
        docketNumber,
        irsPractitioners: mockIrsPractitioners,
        privatePractitioners: mockPrivatePractitioners,
      }));
  });

  it('should return an unauthorized error when the user does not have permission to remove counsel from a case', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

    await expect(
      deleteCounselFromCaseInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        userId: '141d4c7c-4302-465d-89bd-3bc8ae16f07d',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw a ServiceUnavailableError when the case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      deleteCounselFromCaseInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        userId: '141d4c7c-4302-465d-89bd-3bc8ae16f07d',
      }),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await deleteCounselFromCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      userId: '141d4c7c-4302-465d-89bd-3bc8ae16f07d',
    });

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
      ttl: 30,
    });
    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
    });
  });

  it('should remove the private practitioner with the given user id from the case', async () => {
    await deleteCounselFromCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      userId: '141d4c7c-4302-465d-89bd-3bc8ae16f07d',
    });

    expect(
      applicationContext.getPersistenceGateway().deleteUserFromCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('should remove the irs practitioner with the given userId from the case', async () => {
    await deleteCounselFromCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      userId: 'bfd97089-cda0-45e0-8454-dd879023d0af',
    });

    expect(
      applicationContext.getPersistenceGateway().deleteUserFromCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('should throw an error when the user is NOT a private practitioner or irs practitioner', async () => {
    await expect(
      deleteCounselFromCaseInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        userId: '835f072c-5ea1-493c-acb8-d67b05c96f85',
      }),
    ).rejects.toThrow('User is not a practitioner');
  });

  it('should set the contactPrimary.serviceIndicator to Electronic when the case was e-filed', async () => {
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

    await deleteCounselFromCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      userId: mockPrivatePractitioners[0].userId,
    });

    const updatedCase =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate;
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

    await deleteCounselFromCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      userId: mockPrivatePractitioners[0].userId,
    });

    const updatedCase =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate;
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
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseToReturn);
    applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mockImplementation(
        ({ caseToUpdate }) => caseToUpdate,
      );

    await deleteCounselFromCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      userId: mockPrivatePractitioners[0].userId,
    });

    const updatedCase =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate;
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
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseToReturn);
    applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mockImplementation(
        ({ caseToUpdate }) => caseToUpdate,
      );

    await deleteCounselFromCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      userId: mockPrivatePractitioners[0].userId,
    });

    const updatedCase =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate;
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
        new Case(mockCase, { applicationContext }),
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
        new Case(mockCase, { applicationContext }),
      );

      expect(result.petitioners[0].serviceIndicator).toEqual(
        SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      );
    });
  });
});
