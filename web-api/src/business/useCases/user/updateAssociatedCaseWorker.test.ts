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
import { MOCK_LOCK } from '@shared/test/mockLock';
import { MOCK_PRACTITIONER, validUser } from '@shared/test/mockUsers';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getContactPrimary } from '@shared/business/entities/cases/Case';
import {
  updateAssociatedCaseWorker,
  updatePetitionerCases,
  updatePractitionerCases,
} from './updateAssociatedCaseWorker';

const mockPractitioner = {
  ...validUser,
  admissionsDate: '2019-03-01',
  admissionsStatus: 'Active',
  barNumber: 'RA3333',
  birthYear: '1950',
  email: 'test@example.com',
  employer: 'Private',
  firstName: 'Alden',
  lastName: 'Rivas',
  name: 'Alden Rivas',
  originalBarState: 'FL',
  pendingEmail: 'other@example.com',
  pendingEmailVerificationToken: undefined,
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
    user: { ...mockPetitioner, userId: 'cde00f40-56e8-46c2-94c3-b1155b89a203' },
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

  it('should call getCaseByDocketNumber for each docketNumber passed in', async () => {
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
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) =>
        casesMock.find(c => c.docketNumber === docketNumber),
      );

    await updatePetitionerCases({
      applicationContext,
      docketNumbersAssociatedWithUser: ['101-21', MOCK_CASE.docketNumber],
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
    const casesMock = [
      {
        ...MOCK_CASE,
        docketNumber: '101-21',
      },
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            contactId: 'some-other-uuid',
          },
        ],
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) =>
        casesMock.find(c => c.docketNumber === docketNumber),
      );

    await expect(
      updatePetitionerCases({
        applicationContext,
        docketNumbersAssociatedWithUser: ['101-21', MOCK_CASE.docketNumber],
        user: mockPetitionerUser,
      }),
    ).resolves.not.toThrow();

    expect(applicationContext.logger.error).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalledTimes(1);
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
      updatePetitionerCases({
        applicationContext,
        docketNumbersAssociatedWithUser: [MOCK_CASE.docketNumber],
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

    await updatePetitionerCases({
      applicationContext,
      docketNumbersAssociatedWithUser: [MOCK_CASE.docketNumber],
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

    await updatePetitionerCases({
      applicationContext,
      docketNumbersAssociatedWithUser: [MOCK_CASE.docketNumber],
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

    await updatePetitionerCases({
      applicationContext,
      docketNumbersAssociatedWithUser: [MOCK_CASE.docketNumber],
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
    await updatePractitionerCases({
      applicationContext,
      docketNumbersAssociatedWithUser: [MOCK_CASE.docketNumber],
      user: mockPractitionerUser,
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate.privatePractitioners[0].serviceIndicator,
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_ELECTRONIC);
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledTimes(2);
  });
});
