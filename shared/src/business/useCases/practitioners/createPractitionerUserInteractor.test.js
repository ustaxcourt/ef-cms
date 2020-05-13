const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  createPractitionerUserInteractor,
} = require('./createPractitionerUserInteractor');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

const mockUser = {
  admissionsDate: '2019-03-01T21:40:46.415Z',
  admissionsStatus: 'Active',
  barNumber: 'AT5678',
  birthYear: 2019,
  employer: 'Private',
  firmName: 'GW Law Offices',
  firstName: 'bob',
  lastName: 'sagot',
  name: 'Test Attorney',
  originalBarState: 'Oklahoma',
  practitionerType: 'Attorney',
  role: User.ROLES.privatePractitioner,
  userId: 'practitioner1@example.com',
};

describe('create practitioner user', () => {
  let testUser;

  beforeEach(() => {
    testUser = {
      role: 'admissionsclerk',
      userId: 'admissionsclerk',
    };

    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockImplementation(() => testUser);
    applicationContext
      .getPersistenceGateway()
      .createPractitionerUser.mockResolvedValue(mockUser);
  });

  it('creates the practitioner user', async () => {
    const user = await createPractitionerUserInteractor({
      applicationContext,
      user: mockUser,
    });
    expect(user).not.toBeUndefined();
  });

  it('throws unauthorized for a non-internal user', async () => {
    testUser = {
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    };

    await expect(
      createPractitionerUserInteractor({
        applicationContext,
        user: mockUser,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });
});
