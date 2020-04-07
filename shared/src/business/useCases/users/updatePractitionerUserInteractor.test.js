const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updatePractitionerUserInteractor,
} = require('./updatePractitionerUserInteractor');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

const mockUser = {
  admissionsDate: '2019-03-01T21:40:46.415Z',
  admissionsStatus: 'Active',
  barNumber: 'AT5678',
  birthYear: 2019,
  employer: 'Private',
  firmName: 'GW Law Offices',
  isAdmitted: true,
  name: 'Test Attorney',
  originalBarState: 'Oklahoma',
  practitionerType: 'Attorney',
  role: User.ROLES.privatePractitioner,
  userId: 'practitioner1@example.com',
};

describe('update practitioner user', () => {
  let testUser;

  beforeEach(() => {
    testUser = {
      role: 'petitionsclerk',
      userId: 'petitionsclerk',
    };

    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockImplementation(() => testUser);
    applicationContext
      .getPersistenceGateway()
      .updatePractitionerUser.mockResolvedValue(mockUser);
  });

  it('updates the practitioner user', async () => {
    const updatedUser = await updatePractitionerUserInteractor({
      applicationContext,
      user: mockUser,
    });
    expect(updatedUser).not.toBeUndefined();
  });

  it('throws unauthorized for a non-internal user', async () => {
    testUser = {
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    };

    await expect(
      updatePractitionerUserInteractor({
        applicationContext,
        user: mockUser,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });
});
