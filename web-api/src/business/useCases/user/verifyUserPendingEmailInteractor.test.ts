import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import {
  CASE_STATUS_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { DateTime } from 'luxon';
import { MOCK_CASE } from '@shared/test/mockCase';
import {
  TOKEN_EXPIRATION_TIME_HOURS,
  userTokenHasExpired,
  verifyUserPendingEmailInteractor,
} from './verifyUserPendingEmailInteractor';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { getContactPrimary } from '@shared/business/entities/cases/Case';
import {
  mockPetitionerUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import { validUser } from '@shared/test/mockUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getDocketNumbersByUser as getDocketNumbersByUserMock } from '@web-api/persistence/postgres/users/getDocketNumbersByUser';
import { upsertUsers as upsertUsersMock } from '@web-api/persistence/postgres/users/upsertUsers';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';
import { getUserByPendingEmailVerificationToken as getUserByPendingEmailVerificationTokenMock } from '@web-api/persistence/postgres/users/getUserByPendingEmailVerificationToken';
import { getUserByIdOnceAllUpdatesComplete as getUserByIdOnceAllUpdatesCompleteMock } from '@web-api/persistence/postgres/users/getUserByIdOnceAllUpdatesComplete';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';

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

  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const getDocketNumbersByUser = jest.mocked(getDocketNumbersByUserMock);
  const upsertUsers = jest.mocked(upsertUsersMock);
  const getUserByPendingEmailVerificationToken = jest.mocked(
    getUserByPendingEmailVerificationTokenMock,
  );
  const getUserByIdOnceAllUpdatesComplete = jest.mocked(
    getUserByIdOnceAllUpdatesCompleteMock,
  );
  const tryGetLocks = jest.mocked(tryGetLocksMock);

  beforeEach(() => {
    const TOTAL_CASE_COUNT = 100;

    getDocketNumbersByUser.mockResolvedValue(
      Array(TOTAL_CASE_COUNT).fill(undefined),
    );

    applicationContext
      .getPersistenceGateway()
      .getCasesByEmailTotal.mockReturnValue(TOTAL_CASE_COUNT);
  });

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
      birthYear: 1950,
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
    } as DbUser;

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
    } as DbUser;

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
        .isEmailAvailable.mockReturnValue(true);

      getCaseByDocketNumber.mockResolvedValue(mockCase);
    });

    it('should throw unauthorized error when there is no user corresponding to the token provided', async () => {
      getUserByPendingEmailVerificationToken.mockResolvedValue(undefined);

      await expect(
        verifyUserPendingEmailInteractor(applicationContext, {
          token: TOKEN,
        }),
      ).rejects.toThrow('Invalid token');
    });

    it('should throw unauthorized error when the user corresponding to the token is not a valid AuthUser', async () => {
      getUserByPendingEmailVerificationToken.mockResolvedValue({
        ...mockPractitioner,
        pendingEmailVerificationTokenTimestamp: TOKEN_TIMESTAMP_EXPIRED,
      });

      getUserByIdOnceAllUpdatesComplete.mockResolvedValue({
        ...mockPractitioner,
        email: undefined,
        pendingEmailVerificationTokenTimestamp: TOKEN_TIMESTAMP_EXPIRED,
      });

      await expect(
        verifyUserPendingEmailInteractor(applicationContext, {
          token: TOKEN,
        }),
      ).rejects.toThrow('Invalid user');
    });

    it('should throw an unauthorized error when there is no token timestamp', async () => {
      const mockUser = {
        ...mockPractitioner,
        pendingEmailVerificationTokenTimestamp: undefined,
      };

      getUserByPendingEmailVerificationToken.mockResolvedValue(mockUser);
      getUserByIdOnceAllUpdatesComplete.mockResolvedValue(mockUser);

      await expect(
        verifyUserPendingEmailInteractor(applicationContext, {
          token: TOKEN,
        }),
      ).rejects.toThrow('Link has expired');
    });

    it('should throw an unauthorized error when token timestamp is expired', async () => {
      const mockUser = {
        ...mockPractitioner,
        pendingEmailVerificationTokenTimestamp: TOKEN_TIMESTAMP_EXPIRED,
      };

      getUserByPendingEmailVerificationToken.mockResolvedValue(mockUser);
      getUserByIdOnceAllUpdatesComplete.mockResolvedValue(mockUser);

      await expect(
        verifyUserPendingEmailInteractor(applicationContext, {
          token: TOKEN,
        }),
      ).rejects.toThrow('Link has expired');
    });

    it('should throw an error when the pendingEmail address is not available in cognito', async () => {
      const mockUser = {
        ...mockPractitioner,
        pendingEmailVerificationTokenTimestamp: TOKEN_TIMESTAMP_VALID,
      };

      getUserByPendingEmailVerificationToken.mockResolvedValue(mockUser);
      getUserByIdOnceAllUpdatesComplete.mockResolvedValue(mockUser);

      applicationContext
        .getPersistenceGateway()
        .isEmailAvailable.mockReturnValue(false);

      await expect(
        verifyUserPendingEmailInteractor(applicationContext, {
          token: TOKEN,
        }),
      ).rejects.toThrow('Email is not available');
    });

    it('should update the cognito email when token is valid', async () => {
      const mockUser = {
        ...mockPractitioner,
        pendingEmailVerificationTokenTimestamp: TOKEN_TIMESTAMP_VALID,
      };

      getUserByPendingEmailVerificationToken.mockResolvedValue(mockUser);
      getUserByIdOnceAllUpdatesComplete.mockResolvedValue(mockUser);

      await verifyUserPendingEmailInteractor(applicationContext, {
        token: TOKEN,
      });

      expect(upsertUsers.mock.calls[0][0]).toMatchObject([
        {
          email: 'other@example.com',
        },
      ]);
    });

    it('should update the postgres record with the new info when token is valid', async () => {
      const mockUser = {
        ...mockPractitioner,
        pendingEmailVerificationTokenTimestamp: TOKEN_TIMESTAMP_VALID,
      };

      getUserByPendingEmailVerificationToken.mockResolvedValue(mockUser);
      getUserByIdOnceAllUpdatesComplete.mockResolvedValue(mockUser);

      await verifyUserPendingEmailInteractor(applicationContext, {
        token: TOKEN,
      });

      expect(upsertUsers.mock.calls[0][0]).toMatchObject([
        {
          email: 'other@example.com',
          pendingEmail: undefined,
          pendingEmailVerificationToken: undefined,
          pendingEmailVerificationTokenTimestamp: undefined,
        },
      ]);
    });

    it('should call updateUser with email set to pendingEmail and pending fields set to undefined, and service indicator set to electronic with a practitioner user', async () => {
      const mockUser = {
        ...mockPractitioner,
        pendingEmailVerificationTokenTimestamp: TOKEN_TIMESTAMP_VALID,
      };

      getUserByPendingEmailVerificationToken.mockResolvedValue(mockUser);
      getUserByIdOnceAllUpdatesComplete.mockResolvedValue(mockUser);

      await verifyUserPendingEmailInteractor(applicationContext, {
        token: TOKEN,
      });

      expect(upsertUsers.mock.calls[0][0]).toMatchObject([
        {
          email: 'other@example.com',
          entityName: 'Practitioner',
          pendingEmail: undefined,
          pendingEmailVerificationToken: undefined,
          pendingEmailVerificationTokenTimestamp: undefined,
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
      ]);
    });

    it('should call updateUser with email set to pendingEmail and pending fields set to undefined', async () => {
      const mockUser = {
        ...mockPetitioner,
        pendingEmailVerificationTokenTimestamp: TOKEN_TIMESTAMP_VALID,
      };

      getUserByPendingEmailVerificationToken.mockResolvedValue(mockUser);
      getUserByIdOnceAllUpdatesComplete.mockResolvedValue(mockUser);

      await verifyUserPendingEmailInteractor(applicationContext, {
        token: mockPetitioner.pendingEmailVerificationToken!,
      });

      expect(upsertUsers.mock.calls[0][0]).toMatchObject([
        {
          email: 'other@example.com',
          pendingEmail: undefined,
          pendingEmailVerificationToken: undefined,
          pendingEmailVerificationTokenTimestamp: undefined,
        },
      ]);
    });

    it('should acquire a lock', async () => {
      const mockUser = {
        ...mockPetitioner,
        pendingEmailVerificationTokenTimestamp: TOKEN_TIMESTAMP_VALID,
      };

      const mockDocketNumber = MOCK_CASE.docketNumber;

      getDocketNumbersByUser.mockResolvedValue([mockDocketNumber]);

      getUserByPendingEmailVerificationToken.mockResolvedValue(mockUser);
      getUserByIdOnceAllUpdatesComplete.mockResolvedValue(mockUser);

      await verifyUserPendingEmailInteractor(applicationContext, {
        token: mockPetitioner.pendingEmailVerificationToken!,
      });

      expect(tryGetLocks).toHaveBeenCalledWith(
        expect.objectContaining({
          identifiers: [`case|${mockDocketNumber}`],
        }),
      );
    });

    it('should not update user if a lock is not in place', async () => {
      const mockUser = {
        ...mockPetitioner,
        pendingEmailVerificationTokenTimestamp: TOKEN_TIMESTAMP_VALID,
      };

      const mockDocketNumber = MOCK_CASE.docketNumber;

      getDocketNumbersByUser.mockResolvedValue([mockDocketNumber]);

      getUserByPendingEmailVerificationToken.mockResolvedValue(mockUser);
      getUserByIdOnceAllUpdatesComplete.mockResolvedValue(mockUser);

      tryGetLocks.mockResolvedValueOnce([
        { successfullyLocked: false, identifier: 'abc' },
      ]);

      await verifyUserPendingEmailInteractor(applicationContext, {
        token: mockPetitioner.pendingEmailVerificationToken!,
      });

      expect(upsertUsers).not.toHaveBeenCalled();
    });
  });
});
