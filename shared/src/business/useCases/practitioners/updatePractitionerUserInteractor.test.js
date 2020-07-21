const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updatePractitionerUserInteractor,
} = require('./updatePractitionerUserInteractor');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

const mockUser = {
  admissionsDate: '2019-03-01T21:40:46.415Z',
  admissionsStatus: 'Active',
  barNumber: 'AB1111',
  birthYear: 2019,
  email: 'ab@example.com',
  employer: 'Private',
  firmName: 'GW Law Offices',
  firstName: 'Test',
  lastName: 'Attorney',
  name: 'Test Attorney',
  originalBarState: 'Oklahoma',
  practitionerType: 'Attorney',
  role: ROLES.privatePractitioner,
  userId: 'df56e4f8-b302-46ec-b9b3-a6a5e2142092',
};

describe('update practitioner user', () => {
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
      .updatePractitionerUser.mockResolvedValue(mockUser);
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockResolvedValue(mockUser);
    applicationContext
      .getPersistenceGateway()
      .getCasesByUser.mockResolvedValue([]);
  });

  it('updates the practitioner user and overrides a bar number or email passed in with the old user data', async () => {
    const updatedUser = await updatePractitionerUserInteractor({
      applicationContext,
      barNumber: 'AB1111',
      user: { ...mockUser, barNumber: 'AB2222', email: 'bc@example.com' },
    });
    expect(updatedUser).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().updatePractitionerUser,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updatePractitionerUser.mock
        .calls[0][0],
    ).toMatchObject({ user: mockUser });
  });

  it('throws an error if the barNumber/userId combo passed in does not match the user retrieved from getPractitionerByBarNumber', async () => {
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockResolvedValue({
        ...mockUser,
        userId: '2c14ebbc-a6e1-4267-b6b7-e329e592ec93',
      });

    await expect(
      updatePractitionerUserInteractor({
        applicationContext,
        barNumber: 'AB1111',
        user: {
          ...mockUser,
          barNumber: 'AB1111',
          email: 'bc@example.com',
          userId: '9ea9732c-9751-4159-9619-bd27556eb9bc',
        },
      }),
    ).rejects.toThrow('Bar number does not match user data.');
  });

  it('throws unauthorized for a non-internal user', async () => {
    testUser = {
      role: ROLES.petitioner,
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
