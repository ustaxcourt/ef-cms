import {
  CASE_STATUS_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getContactPrimary } from '../../entities/cases/Case';
import { validUser } from '../../../test/mockUsers';
import { verifyUserPendingEmailInteractor } from './verifyUserPendingEmailInteractor';

describe('verifyUserPendingEmailInteractor', () => {
  const TOKEN = '41189629-abe1-46d7-b7a4-9d3834f919cb';
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
    pendingEmailVerificationToken: TOKEN,
    practitionerType: 'Attorney',
    role: ROLES.privatePractitioner,
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
    applicationContext.getCurrentUser.mockReturnValue(mockPractitioner);
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
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });

    await expect(
      verifyUserPendingEmailInteractor(applicationContext, {
        token: 'abc',
      }),
    ).rejects.toThrow('Unauthorized to manage emails');
  });

  it('should throw an unauthorized error when the token passed as an argument does not match stored token on user', async () => {
    await expect(
      verifyUserPendingEmailInteractor(applicationContext, {
        token: 'abc',
      }),
    ).rejects.toThrow('Tokens do not match');
  });

  it('should throw an unauthorized error when the token passed as an argument and the token store on the user are both undefined', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...mockPractitioner,
      pendingEmailVerificationToken: undefined,
    });

    await expect(
      verifyUserPendingEmailInteractor(applicationContext, {
        token: undefined,
      }),
    ).rejects.toThrow('Tokens do not match');
  });

  it('should throw an error when the pendingEmail address is not available in cognito', async () => {
    applicationContext
      .getPersistenceGateway()
      .isEmailAvailable.mockReturnValue(false);

    await expect(
      verifyUserPendingEmailInteractor(applicationContext, {
        token: TOKEN,
      }),
    ).rejects.toThrow('Email is not available');
  });

  it('should update the cognito email when tokens match', async () => {
    await expect(
      verifyUserPendingEmailInteractor(applicationContext, {
        token: TOKEN,
      }),
    ).resolves.not.toThrow('Tokens do not match');

    const adminUpdateUserAttributesResult =
      applicationContext.getCognito().adminUpdateUserAttributes.mock
        .calls[0][0];

    expect(adminUpdateUserAttributesResult.UserAttributes[0]).toMatchObject({
      Name: 'email',
      Value: 'other@example.com',
    });
    expect(adminUpdateUserAttributesResult).toMatchObject({
      Username: 'test@example.com',
    });
  });

  it('should update the dynamo record with the new info', async () => {
    await verifyUserPendingEmailInteractor(applicationContext, {
      token: TOKEN,
    });

    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
        .user,
    ).toMatchObject({
      email: 'other@example.com',
      pendingEmail: undefined,
      pendingEmailVerificationToken: undefined,
    });
  });
});
