const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  createPractitionerUserInteractor,
} = require('./createPractitionerUserInteractor');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

const mockUser = {
  admissionsDate: '2019-03-01',
  admissionsStatus: 'Active',
  barNumber: 'AT5678',
  birthYear: 2019,
  employer: 'Private',
  firmName: 'GW Law Offices',
  firstName: 'bob',
  lastName: 'sagot',
  name: 'Test Attorney',
  originalBarState: 'IL',
  practitionerType: 'Attorney',
  role: ROLES.privatePractitioner,
  userId: '07044afe-641b-4d75-a84f-0698870b7650',
};

describe('create practitioner user', () => {
  let testUser;

  beforeEach(() => {
    testUser = {
      role: ROLES.admissionsClerk,
      userId: 'admissionsclerk',
    };

    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockImplementation(() => testUser);
    applicationContext
      .getPersistenceGateway()
      .createPractitionerUser.mockResolvedValue(mockUser);
  });

  it('creates the practitioner user', async () => {
    const user = await createPractitionerUserInteractor(applicationContext, {
      user: mockUser,
    });
    expect(user).not.toBeUndefined();
  });

  it('throws unauthorized for a non-internal user', async () => {
    testUser = {
      role: ROLES.petitioner,
      userId: '6a2a8f95-0223-442e-8e55-5f094c6bca15',
    };

    await expect(
      createPractitionerUserInteractor(applicationContext, {
        user: mockUser,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });
});
