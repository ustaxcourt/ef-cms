const {
  createAttorneyUserInteractor,
} = require('./createAttorneyUserInteractor');
const {
  UnauthorizedError,
} = require('../../../../../shared/src/errors/errors');
const { User } = require('../../entities/User');

const mockUser = {
  admissionsDate: '2019-03-01T21:40:46.415Z',
  birthYear: 2019,
  employer: 'Private',
  isAdmitted: true,
  name: 'Test Attorney',
  practitionerType: 'Attorney',
  role: User.ROLES.privatePractitioner,
  userId: 'practitioner1@example.com',
};

describe('create attorney user', () => {
  let applicationContext;
  let testUser;

  beforeEach(() => {
    testUser = {
      role: 'petitionsclerk',
      userId: 'petitionsclerk',
    };

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => testUser,
      getPersistenceGateway: () => ({
        createAttorneyUser: () => Promise.resolve(mockUser),
      }),
    };
  });

  it('creates the attorney user', async () => {
    const user = await createAttorneyUserInteractor({
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
      createAttorneyUserInteractor({
        applicationContext,
        user: mockUser,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });
});
