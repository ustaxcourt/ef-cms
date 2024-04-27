import {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  PARTY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import {
  MOCK_CASE,
  MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
} from '@shared/test/mockCase';
import { MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';
import { MOCK_LOCK } from '@shared/test/mockLock';
import { MOCK_PRACTITIONER, validUser } from '@shared/test/mockUsers';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import { getContactPrimary } from '@shared/business/entities/cases/Case';
import {
  updateAssociatedCaseWorker,
  updatePetitionerCase,
  updatePractitionerCase,
} from './updateAssociatedCaseWorker';

const mockPractitioner = {
  ...validUser,
  admissionsDate: '2019-03-01',
  admissionsStatus: 'Active',
  barNumber: 'RA3333',
  birthYear: '1950',
  email: 'test@example.com',
  firstName: 'Alden',
  lastName: 'Rivas',
  name: 'Alden Rivas',
  originalBarState: 'FL',
  pendingEmail: 'other@example.com',
  pendingEmailVerificationToken: undefined,
  practiceType: 'Private',
  practitionerType: 'Attorney',
  role: ROLES.privatePractitioner,
};

const mockPetitioner = {
  ...validUser,
  firstName: 'Olden',
  lastName: 'Vivas',
  pendingEmail: 'other@example.com',
  pendingEmailVerificationToken: undefined,
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

describe('updateAssociatedCaseWorker', () => {
  it('should log an error when the practitioner is not found on one of their associated cases by userId', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...mockCase,
        privatePractitioners: [],
      });

    await updateAssociatedCaseWorker(applicationContext, {
      docketNumber: '101-18',
      user: mockPractitioner,
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

    await updateAssociatedCaseWorker(applicationContext, {
      docketNumber: '101-18',
      user: {
        ...mockPetitioner,
        userId: 'cde00f40-56e8-46c2-94c3-b1155b89a203',
      },
    });

    expect(applicationContext.logger.error.mock.calls[0][0]).toEqual(
      'Could not find user|cde00f40-56e8-46c2-94c3-b1155b89a203 on 101-18',
    );
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).not.toHaveBeenCalled();
  });

  describe('locking', () => {
    it('should throw a ServiceUnavailableError if a Case is currently locked', async () => {
      applicationContext
        .getPersistenceGateway()
        .getLock.mockImplementation(() => MOCK_LOCK);
      await expect(
        updateAssociatedCaseWorker(applicationContext, {
          docketNumber: '123-45',
          user: MOCK_PRACTITIONER,
        }),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(
        applicationContext.getPersistenceGateway().getCaseByDocketNumber,
      ).not.toHaveBeenCalled();
    });

    it('should acquire a lock that lasts for 15 minutes', async () => {
      applicationContext
        .getPersistenceGateway()
        .getLock.mockImplementation(() => undefined);
      await updateAssociatedCaseWorker(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        user: MOCK_PRACTITIONER,
      });

      expect(
        applicationContext.getPersistenceGateway().createLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifier: `case|${MOCK_CASE.docketNumber}`,
        ttl: 900,
      });
    });

    it('should remove the lock', async () => {
      await updateAssociatedCaseWorker(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        user: MOCK_PRACTITIONER,
      });

      expect(
        applicationContext.getPersistenceGateway().removeLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      });
    });
  });

  describe('cases', () => {
    let mockPractitionerUser;
    const UPDATED_EMAIL = 'hello@example.com';

    beforeEach(() => {
      mockPractitionerUser = {
        ...validUser,
        barNumber: 'SS8888',
        email: UPDATED_EMAIL,
        role: ROLES.privatePractitioner,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      };

      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...MOCK_CASE,
          privatePractitioners: [mockPractitionerUser],
        });
    });

    it('should call generateAndServeDocketEntry with verified petitioner for servedParties', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...mockCase,
          privatePractitioners: [],
        });
      await updateAssociatedCaseWorker(applicationContext, {
        docketNumber: mockCase.docketNumber,
        user: mockPetitioner,
      });
      const { servedParties } =
        applicationContext.getUseCaseHelpers().generateAndServeDocketEntry.mock
          .calls[0][0];
      expect(servedParties.electronic).toEqual([
        { email: 'user@example.com', name: 'Test Petitioner' },
      ]);
    });

    it("should update the user's case with the new email", async () => {
      await updateAssociatedCaseWorker(applicationContext, {
        docketNumber: mockCase.docketNumber,
        user: mockPractitioner,
      });

      expect(
        applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
      ).toHaveBeenCalled();

      expect(
        applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
          .calls[0][0].caseToUpdate,
      ).toMatchObject({
        privatePractitioners: [{ email: 'test@example.com' }],
      });
    });

    it('should not send any user notifications if the call to updateCase fails', async () => {
      applicationContext
        .getUseCaseHelpers()
        .updateCaseAndAssociations.mockRejectedValueOnce(
          new Error('updateCaseAndAssociations failure'),
        );

      await expect(
        updateAssociatedCaseWorker(applicationContext, {
          docketNumber: mockCase.docketNumber,
          user: mockPractitioner,
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
            isMinuteEntry: 'false',
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
        updateAssociatedCaseWorker(applicationContext, {
          docketNumber: mockCase.docketNumber,
          user: mockPetitioner,
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
        updateAssociatedCaseWorker(applicationContext, {
          docketNumber: mockCase.docketNumber,
          user: mockPetitioner,
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
        updateAssociatedCaseWorker(applicationContext, {
          docketNumber: mockCase.docketNumber,
          user: mockPetitioner,
        }),
      ).resolves.toBeUndefined(); // has no return value

      expect(
        applicationContext.getUseCaseHelpers().generateAndServeDocketEntry,
      ).not.toHaveBeenCalled();
    });
  });
});
describe('updatePetitionerCases', () => {
  const UPDATED_EMAIL = 'hello@example.com';
  const mockPetitionerUser = {
    ...validUser,
    email: UPDATED_EMAIL,
    role: ROLES.petitioner,
    userId: getContactPrimary(MOCK_CASE).contactId,
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
  });

  it('should call getCaseByDocketNumber for passed in docketNumber', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(mockCase);

    await updatePetitionerCase({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
      user: mockPetitionerUser,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0],
    ).toMatchObject({
      docketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalled();
  });

  it('should log an error if the petitioner is not found on a case returned by getCasesForUser', async () => {
    const caseMock = {
      ...MOCK_CASE,
      petitioners: [
        {
          ...MOCK_CASE.petitioners[0],
          contactId: 'some-other-uuid',
        },
      ],
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(caseMock);

    await expect(
      updatePetitionerCase({
        applicationContext,
        docketNumber: '101-21',
        user: mockPetitionerUser,
      }),
    ).resolves.not.toThrow();

    expect(applicationContext.logger.error).toHaveBeenCalledTimes(1);
    expect(applicationContext.logger.error).toHaveBeenCalledWith(
      `Could not find user|${mockPetitionerUser.userId} on ${caseMock.docketNumber}`,
    );
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).not.toHaveBeenCalled();
  });

  it('should log an error if any case update is invalid and prevent updateCaseAndAssociations from being called', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        docketNumber: 'not a docket number',
        invalidCase: 'yep',
      });

    await expect(
      updatePetitionerCase({
        applicationContext,
        docketNumber: MOCK_CASE.docketNumber,
        user: mockPetitionerUser,
      }),
    ).rejects.toThrow('entity was invalid');

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).not.toHaveBeenCalled();
  });

  it('should call updateCaseAndAssociations with updated email address for a contactSecondary', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.petitionerDeceasedSpouse,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            contactId: '41189629-abe1-46d7-b7a4-9d3834f919cb',
          },
          {
            ...MOCK_CASE.petitioners[0],
            contactId: mockPetitionerUser.userId,
            contactType: CONTACT_TYPES.secondary,
            inCareOf: 'Barney',
          },
        ],
      });

    await updatePetitionerCase({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
      user: mockPetitionerUser,
    });

    const { caseToUpdate } =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0];
    expect(caseToUpdate.petitioners[1].email).toBe(UPDATED_EMAIL);
    expect(caseToUpdate.docketNumber).toBe(MOCK_CASE.docketNumber);
  });

  it('should update the petitioner service indicator when they are not represented', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.petitionerDeceasedSpouse,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            contactId: '41189629-abe1-46d7-b7a4-9d3834f919cb',
          },
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
      });

    await updatePetitionerCase({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
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

  it('should update the petitioner service indicator when they are represented', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
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
      });

    await updatePetitionerCase({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
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

describe('updatePractitionerCases', () => {
  let mockPractitionerUser;
  const UPDATED_EMAIL = 'hello@example.com';

  beforeEach(() => {
    mockPractitionerUser = {
      ...validUser,
      barNumber: 'SS8888',
      email: UPDATED_EMAIL,
      role: ROLES.privatePractitioner,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        privatePractitioners: [mockPractitionerUser],
      });
  });

  it('should set the service serviceIndicator to ELECTRONIC when confirming the email', async () => {
    await updatePractitionerCase({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
      user: mockPractitionerUser,
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate.privatePractitioners[0].serviceIndicator,
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_ELECTRONIC);
  });
});
