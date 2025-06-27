import { getPractitionerByBarNumberInteractor } from './getPractitionerByBarNumberInteractor';
import { UnauthorizedError } from '@web-api/errors/errors';

jest.mock('../../../../../shared/src/authorization/authorizationClientService', () => ({
  isAuthorized: jest.fn(),
  ROLE_PERMISSIONS: {
    MANAGE_PRACTITIONER_USERS: 'MANAGE_PRACTITIONER_USERS',
  },
}));

import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '../../../../../shared/src/authorization/authorizationClientService';

// Mock Practitioner entity
jest.mock('../../../../../shared/src/business/entities/Practitioner', () => {
  return {
    Practitioner: function (raw) {
      return {
        validate: function () {
          return this;
        },
        toRawObject: function () {
          return raw;
        },
      };
    },
  };
});

describe('getPractitionerByBarNumberInteractor', () => {
  const barNumber = 'AB1234';
  const basePractitioner = {
    barNumber,
    admissionsDate: '2020-01-01',
    admissionsStatus: 'Active',
    originalBarState: 'MD',
    name: 'Test Practitioner',
    practiceType: 'PracticeType',
    practitionerType: 'Attorney',
  };

  let mockApplicationContext: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockApplicationContext = {
      getPersistenceGateway: () => ({
        getPractitionerByBarNumber: jest.fn(),
      }),
    };
  });

  it('returns full practitioner for authorized logged-in user', async () => {
    (isAuthorized as unknown as jest.Mock).mockImplementation((user, permission) => {
      return (
        user.userId === 'abc123' &&
        permission === ROLE_PERMISSIONS.MANAGE_PRACTITIONER_USERS
      );
    });

    const getPractitionerByBarNumber = jest.fn().mockImplementation(() => basePractitioner);
    mockApplicationContext.getPersistenceGateway = () => ({
      getPractitionerByBarNumber,
    });

    const result = await getPractitionerByBarNumberInteractor(
      mockApplicationContext,
      { barNumber },
      {
        userId: 'abc123',
        role: 'adc',
        email: '',
        name: '',
      },
    );

    expect(result).toMatchObject(basePractitioner);
  });

  it('throws UnauthorizedError if user is logged in but not authorized', async () => {
    (isAuthorized as unknown as jest.Mock).mockImplementation(() => false);

    await expect(() =>
      getPractitionerByBarNumberInteractor(
        mockApplicationContext,
        { barNumber },
        {
          userId: 'not-allowed',
          role: 'judge',
          email: '',
          name: '',
        },
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('returns limited public data when no user is logged in', async () => {
    (isAuthorized as unknown as jest.Mock).mockImplementation(() => false);

    const getPractitionerByBarNumber = jest.fn().mockImplementation(() => basePractitioner);
    mockApplicationContext.getPersistenceGateway = () => ({
      getPractitionerByBarNumber,
    });

    const result = await getPractitionerByBarNumberInteractor(
      mockApplicationContext,
      { barNumber },
      {
        role: 'adc',
        userId: '',
        email: '',
        name: ''
      }, // not logged in
    );

    expect(result).toEqual([
      {
        admissionsDate: '2020-01-01',
        admissionsStatus: 'Active',
        barNumber: 'AB1234',
        contact: { state: 'MD' },
        name: 'Test Practitioner',
        originalBarState: 'MD',
        practiceType: 'PracticeType',
        practitionerType: 'Attorney',
      },
    ]);
  });

  it('returns null when logged-in user and practitioner not found', async () => {
    (isAuthorized as unknown as jest.Mock).mockImplementation(() => true);

    const getPractitionerByBarNumber = jest.fn().mockImplementation(() => null);
    mockApplicationContext.getPersistenceGateway = () => ({
      getPractitionerByBarNumber,
    });

    const result = await getPractitionerByBarNumberInteractor(
      mockApplicationContext,
      { barNumber },
      {
        userId: 'user',
        role: 'adc',
        email: '',
        name: '',
      },
    );

    expect(result).toBeNull();
  });

  it('returns empty array when public user and practitioner not found', async () => {
    (isAuthorized as unknown as jest.Mock).mockImplementation(() => false);

    const getPractitionerByBarNumber = jest.fn().mockImplementation(() => null);
    mockApplicationContext.getPersistenceGateway = () => ({
      getPractitionerByBarNumber,
    });

    const result = await getPractitionerByBarNumberInteractor(
      mockApplicationContext,
      { barNumber },
      {
        role: 'adc',
        userId: '',
        email: '',
        name: ''
      }, // not logged in
    );

    expect(result).toEqual([]);
  });
});
