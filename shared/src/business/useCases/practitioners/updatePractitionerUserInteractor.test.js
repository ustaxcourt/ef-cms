const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updatePractitionerUserInteractor,
} = require('./updatePractitionerUserInteractor');
const { ROLES } = require('../../entities/EntityConstants');
const { SERVICE_INDICATOR_TYPES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');
jest.mock('../users/generateChangeOfAddress');

describe('updatePractitionerUserInteractor', () => {
  let testUser;
  let mockUser = {
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

  beforeEach(() => {
    testUser = {
      role: ROLES.admissionsClerk,
      userId: 'admissionsclerk',
    };

    applicationContext.getCurrentUser.mockImplementation(() => testUser);
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockResolvedValue(mockUser);
    applicationContext
      .getPersistenceGateway()
      .updatePractitionerUser.mockResolvedValue(mockUser);
  });

  it('should throw an unauthorized error when the user does not have permission to update the practitioner user', async () => {
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

  it("should set the practitioner's serviceIndicator to electronic when an email is added", async () => {
    mockUser = {
      ...mockUser,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    const updatedUser = await updatePractitionerUserInteractor({
      applicationContext,
      barNumber: 'AB1111',
      user: {
        ...mockUser,
        barNumber: 'AB2222',
        email: 'bc@example.com',
      },
    });

    expect(updatedUser.serviceIndicator).toBe(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });

  it('updates the practitioner user and does NOT override a bar number or email when the original user had an email', async () => {
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

  it('updates the practitioner user and adds an email if the original user did not have an email', async () => {
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockResolvedValue({
        ...mockUser,
        email: undefined,
      });

    const updatedUser = await updatePractitionerUserInteractor({
      applicationContext,
      barNumber: 'AB1111',
      user: { ...mockUser, email: 'admissionsclerk@example.com' },
    });

    expect(updatedUser).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().updatePractitionerUser,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updatePractitionerUser.mock
        .calls[0][0].user.email,
    ).toEqual('admissionsclerk@example.com');
  });
});
