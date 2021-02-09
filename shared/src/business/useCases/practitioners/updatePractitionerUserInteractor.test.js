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
  let mockPractitioner;

  beforeEach(() => {
    testUser = {
      role: ROLES.admissionsClerk,
      userId: 'admissionsclerk',
    };

    mockPractitioner = {
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

    applicationContext.getCurrentUser.mockImplementation(() => testUser);
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockImplementation(() => mockPractitioner);
    applicationContext
      .getPersistenceGateway()
      .updatePractitionerUser.mockImplementation(({ user }) => user);
    applicationContext
      .getPersistenceGateway()
      .isEmailAvailable.mockReturnValue(true);
  });

  it('should throw an unauthorized error when the user does not have permission to update the practitioner user', async () => {
    testUser = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };

    await expect(
      updatePractitionerUserInteractor({
        applicationContext,
        user: mockPractitioner,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws an error if the barNumber/userId combo passed in does not match the user retrieved from getPractitionerByBarNumber', async () => {
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockResolvedValue({
        ...mockPractitioner,
        userId: '2c14ebbc-a6e1-4267-b6b7-e329e592ec93',
      });

    await expect(
      updatePractitionerUserInteractor({
        applicationContext,
        barNumber: 'AB1111',
        user: {
          ...mockPractitioner,
          barNumber: 'AB1111',
          email: 'bc@example.com',
          userId: '9ea9732c-9751-4159-9619-bd27556eb9bc',
        },
      }),
    ).rejects.toThrow('Bar number does not match user data.');
  });

  it("should set the practitioner's serviceIndicator to electronic when an email is added", async () => {
    mockPractitioner = {
      ...mockPractitioner,
      email: undefined,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    const updatedUser = await updatePractitionerUserInteractor({
      applicationContext,
      barNumber: 'AB1111',
      user: {
        ...mockPractitioner,
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
      user: {
        ...mockPractitioner,
        barNumber: 'AB2222',
        email: 'bc@example.com',
      },
    });

    expect(updatedUser).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().updatePractitionerUser,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updatePractitionerUser.mock
        .calls[0][0],
    ).toMatchObject({ user: mockPractitioner });
  });

  it('updates the practitioner user and adds an email if the original user did not have an email', async () => {
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockResolvedValue({
        ...mockPractitioner,
        email: undefined,
      });

    const updatedUser = await updatePractitionerUserInteractor({
      applicationContext,
      barNumber: 'AB1111',
      user: { ...mockPractitioner, email: 'admissionsclerk@example.com' },
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

  describe('updating practitioner email', () => {
    it('should throw unauthorized error when the logged in user does not have permission to manage emails', async () => {
      testUser = {
        role: ROLES.petitioner,
        userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
      };

      await expect(
        updatePractitionerUserInteractor({
          applicationContext,
          user: mockPractitioner,
        }),
      ).rejects.toThrow('Unauthorized for updating practitioner user');
    });

    it('should throw an error when user.updatedEmail is not available in cognito', async () => {
      applicationContext
        .getPersistenceGateway()
        .isEmailAvailable.mockReturnValue(false);

      await expect(
        updatePractitionerUserInteractor({
          applicationContext,
          user: {
            ...mockPractitioner,
            confirmEmail: 'exists@example.com',
            updatedEmail: 'exists@example.com',
          },
        }),
      ).rejects.toThrow('Email is not available');
    });

    it('should update the user with the new user.updatedEmail value', async () => {
      await updatePractitionerUserInteractor({
        applicationContext,
        user: {
          ...mockPractitioner,
          confirmEmail: 'free-email-to-use@example.com',
          updatedEmail: 'free-email-to-use@example.com',
        },
      });

      expect(
        applicationContext.getPersistenceGateway().updatePractitionerUser.mock
          .calls[0][0].user,
      ).toMatchObject({
        pendingEmail: 'free-email-to-use@example.com',
        pendingEmailVerificationToken: expect.anything(),
      });
    });

    it('should call applicationContext.getUseCaseHelpers().sendEmailVerificationLink to send the verification link to the user', async () => {
      await updatePractitionerUserInteractor({
        applicationContext,
        user: {
          ...mockPractitioner,
          confirmEmail: 'free-email-to-use@example.com',
          updatedEmail: 'free-email-to-use@example.com',
        },
      });

      expect(
        applicationContext.getUseCaseHelpers().sendEmailVerificationLink.mock
          .calls[0][0],
      ).toMatchObject({
        pendingEmail: 'free-email-to-use@example.com',
        pendingEmailVerificationToken: expect.anything(),
      });
    });
  });
});
