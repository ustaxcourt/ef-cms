import { createPractitionerUser } from './createPractitionerUser';
import { createBarNumber } from '@web-api/persistence/postgres/users/createBarNumber';
import { getUniqueId } from '@shared/sharedAppContext';
import {
  ACCOUNT_STATUS,
  PRACTICE_TYPE_OPTIONS,
  PRACTITIONER_TYPE_OPTIONS,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';

jest.mock('@web-api/persistence/postgres/users/createBarNumber');
jest.mock('@shared/sharedAppContext');

describe('createPractitionerUser', () => {
  const mockGetUniqueId = jest.mocked(getUniqueId);
  const mockCreateBarNumber = jest.mocked(createBarNumber);

  const sampleUser = {
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    admissionsDate: '2020-01-01',
    admissionsStatus: 'Active',
    birthYear: 1980,
    practiceType: PRACTICE_TYPE_OPTIONS[2],
    employer: 'Law Firm',
    firmName: 'Smith & Co',
    originalBarState: 'NY',
    userId: 'b07d648b-f5f3-4e81-bdb9-6e744f1d4125',
    accountStatus: ACCOUNT_STATUS.active,
    contact: {
      address1: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      countryType: 'domestic', // or 'international' as appropriate
      phone: '555-555-5555',
    },
    practitionerType: PRACTITIONER_TYPE_OPTIONS[0],
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    name: 'Alice Smith', // example value
    role: ROLES.privatePractitioner,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUniqueId.mockReturnValue('c17d648b-f5f3-4e81-bdb9-6e744f1d4126');
  });

  it('should use existing barNumber if provided', async () => {
    const userWithBarNumber = {
      ...sampleUser,
      barNumber: 'EXIST123',
    };

    const result = await createPractitionerUser({ user: userWithBarNumber });

    expect(createBarNumber).not.toHaveBeenCalled();
    expect(mockGetUniqueId).toHaveBeenCalled();
    expect(result.barNumber).toEqual(userWithBarNumber.barNumber);
  });

  it('should generate barNumber if not provided', async () => {
    mockCreateBarNumber.mockResolvedValue('NEWBAR456');

    await createPractitionerUser({ user: sampleUser });

    expect(createBarNumber).toHaveBeenCalledWith({
      initials: 'SA',
    });

    expect(mockGetUniqueId).toHaveBeenCalled();
  });
});
