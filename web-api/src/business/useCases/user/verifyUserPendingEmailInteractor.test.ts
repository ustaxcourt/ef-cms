import {
  CASE_STATUS_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { getContactPrimary } from '../../../../../shared/src/business/entities/cases/Case';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import { validUser } from '../../../../../shared/src/test/mockUsers';
import { verifyUserPendingEmailInteractor } from './verifyUserPendingEmailInteractor';

describe('verifyUserPendingEmailInteractor', () => {
  const TOKEN = '41189629-abe1-46d7-b7a4-9d3834f919cb';
  const mockPractitioner = {
    ...validUser,
    ...mockPrivatePractitionerUser,
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
    pendingEmailVerificationToken: TOKEN,
    pendingEmailVerificationTokenTimestamp: createISODateString(),
    practiceType: 'Private',
    practitionerType: 'Attorney',
    role: ROLES.privatePractitioner,
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
  };

  const mockPetitioner = {
    ...validUser,
    ...mockPetitionerUser,
    firstName: 'Olden',
    lastName: 'Vivas',
    pendingEmail: 'other@example.com',
    pendingEmailVerificationToken: '42289629-abe1-46d7-b7a4-9d3834f919xd',
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

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(mockPractitioner);

    applicationContext
      .getPersistenceGateway()
      .isEmailAvailable.mockReturnValue(true);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue([mockCase.docketNumber]);
  });

  it('should throw unauthorized error when user does not have permission to verify emails', async () => {
    await expect(
      verifyUserPendingEmailInteractor(
        applicationContext,
        {
          token: 'abc',
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('Unauthorized to manage emails');
  });

  it('should throw an unauthorized error when the token passed as an argument does not match stored token on user', async () => {
    await expect(
      verifyUserPendingEmailInteractor(
        applicationContext,
        {
          token: 'abc',
        },
        mockPrivatePractitionerUser,
      ),
    ).rejects.toThrow('Tokens do not match');
  });

  it('should throw an unauthorized error when the token passed as an argument and the token store on the user are both undefined', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...mockPractitioner,
      pendingEmailVerificationToken: undefined,
    });

    await expect(
      verifyUserPendingEmailInteractor(
        applicationContext,
        {
          token: undefined as any,
        },
        mockPrivatePractitionerUser,
      ),
    ).rejects.toThrow('Tokens do not match');
  });

  it('should throw an error when the pendingEmail address is not available in cognito', async () => {
    applicationContext
      .getPersistenceGateway()
      .isEmailAvailable.mockReturnValue(false);

    await expect(
      verifyUserPendingEmailInteractor(
        applicationContext,
        {
          token: TOKEN,
        },
        mockPrivatePractitionerUser,
      ),
    ).rejects.toThrow('Email is not available');
  });

  it('should update the cognito email when tokens match', async () => {
    await verifyUserPendingEmailInteractor(
      applicationContext,
      {
        token: TOKEN,
      },
      mockPrivatePractitionerUser,
    );

    expect(applicationContext.getUserGateway().updateUser).toHaveBeenCalledWith(
      applicationContext,
      {
        attributesToUpdate: {
          email: 'other@example.com',
        },
        email: 'test@example.com',
      },
    );
  });

  it('should update the dynamo record with the new info', async () => {
    await verifyUserPendingEmailInteractor(
      applicationContext,
      {
        token: TOKEN,
      },
      mockPrivatePractitionerUser,
    );

    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
        .user,
    ).toMatchObject({
      email: 'other@example.com',
      pendingEmail: undefined,
      pendingEmailVerificationToken: undefined,
    });
  });

  it('should call updateUser with email set to pendingEmail and pendingEmail set to undefined, and service indicator set to electronic with a practitioner user', async () => {
    await verifyUserPendingEmailInteractor(
      applicationContext,
      {
        token: TOKEN,
      },
      mockPrivatePractitionerUser,
    );

    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
        .user,
    ).toMatchObject({
      email: 'other@example.com',
      entityName: 'Practitioner',
      pendingEmail: undefined,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });
  });

  it('should call updateUser with email set to pendingEmail and pendingEmail set to undefined', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(mockPetitioner);

    await verifyUserPendingEmailInteractor(
      applicationContext,
      {
        token: mockPetitioner.pendingEmailVerificationToken,
      },
      mockPetitionerUser,
    );

    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
        .user,
    ).toMatchObject({
      email: 'other@example.com',
      pendingEmail: undefined,
    });
  });
});
