import {
  CASE_STATUS_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { DateTime } from 'luxon';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import {
  TOKEN_EXPIRATION_TIME_HOURS,
  userTokenHasExpired,
  verifyUserPendingEmailInteractor,
} from './verifyUserPendingEmailInteractor';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { getContactPrimary } from '../../../../../shared/src/business/entities/cases/Case';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import { validUser } from '../../../../../shared/src/test/mockUsers';

describe('Verify User Pending Email', () => {
  const TOKEN = '41189629-abe1-46d7-b7a4-9d3834f919cb';
  const TOKEN_TIMESTAMP_VALID = createISODateString();
  // .001 hours = 3.6 seconds. This gives us a reasonable degree of accuracy
  // around expiration boundaries without creating a flaky test.
  const TOKEN_TIMESTAMP_ALMOST_INVALID = DateTime.now()
    .setZone('utc')
    .minus({ hours: TOKEN_EXPIRATION_TIME_HOURS - 0.001 })
    .toISO()!;

  const TOKEN_TIMESTAMP_EXPIRED: string = DateTime.now()
    .setZone('utc')
    .minus({ hours: TOKEN_EXPIRATION_TIME_HOURS + 0.001 })
    .toISO()!;

  describe('userTokenHasExpired', () => {
    it('should return true when no token', () => {
      expect(userTokenHasExpired(undefined)).toBe(true);
    });
    it('should return true when token is outside the expiration window', () => {
      expect(userTokenHasExpired(TOKEN_TIMESTAMP_EXPIRED)).toBe(true);
    });
    it('should return false when token is fresh', () => {
      expect(userTokenHasExpired(TOKEN_TIMESTAMP_VALID)).toBe(false);
    });
    it('should return false when token is almost but not yet expired', () => {
      expect(userTokenHasExpired(TOKEN_TIMESTAMP_ALMOST_INVALID)).toBe(false);
    });
  });

  describe('verifyUserPendingEmailInteractor', () => {
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
      pendingEmailVerificationTokenTimestamp: TOKEN_TIMESTAMP_VALID,
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
      pendingEmailVerificationTokenTimestamp: TOKEN_TIMESTAMP_VALID,
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

    it('should throw an unauthorized error when there is no token timestamp', async () => {
      applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
        ...mockPractitioner,
        pendingEmailVerificationTokenTimestamp: undefined,
      });

      await expect(
        verifyUserPendingEmailInteractor(
          applicationContext,
          {
            token: TOKEN,
          },
          mockPrivatePractitionerUser,
        ),
      ).rejects.toThrow('Link has expired');
    });

    it('should throw an unauthorized error when token timestamp is expired', async () => {
      applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
        ...mockPractitioner,
        pendingEmailVerificationTokenTimestamp: TOKEN_TIMESTAMP_EXPIRED,
      });

      await expect(
        verifyUserPendingEmailInteractor(
          applicationContext,
          {
            token: TOKEN,
          },
          mockPrivatePractitionerUser,
        ),
      ).rejects.toThrow('Link has expired');
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

      expect(
        applicationContext.getUserGateway().updateUser,
      ).toHaveBeenCalledWith(applicationContext, {
        attributesToUpdate: {
          email: 'other@example.com',
        },
        email: 'test@example.com',
      });
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
        pendingEmailVerificationTokenTimestamp: undefined,
      });
    });

    it('should call updateUser with email set to pendingEmail and pending fields set to undefined, and service indicator set to electronic with a practitioner user', async () => {
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
        pendingEmailVerificationToken: undefined,
        pendingEmailVerificationTokenTimestamp: undefined,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      });
    });

    it('should call updateUser with email set to pendingEmail and pending fields set to undefined', async () => {
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
        pendingEmailVerificationToken: undefined,
        pendingEmailVerificationTokenTimestamp: undefined,
      });
    });
  });
});
