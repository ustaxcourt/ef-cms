const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updatePractitionerUserInteractor,
} = require('./updatePractitionerUserInteractor');
const { MOCK_PRACTITIONER } = require('../../../test/mockUsers');
const { ROLES } = require('../../entities/EntityConstants');
const { SERVICE_INDICATOR_TYPES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');
jest.mock('../users/generateChangeOfAddress');
const { generateChangeOfAddress } = require('../users/generateChangeOfAddress');

describe('updatePractitionerUserInteractor', () => {
  let testUser;
  let mockPractitioner = MOCK_PRACTITIONER;

  beforeEach(() => {
    testUser = {
      role: ROLES.admissionsClerk,
      userId: 'admissionsclerk',
    };
    mockPractitioner = { ...MOCK_PRACTITIONER };

    applicationContext.getCurrentUser.mockImplementation(() => testUser);
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockImplementation(() => mockPractitioner);
    applicationContext
      .getPersistenceGateway()
      .updatePractitionerUser.mockImplementation(({ user }) => user);
    applicationContext
      .getPersistenceGateway()
      .createNewPractitionerUser.mockImplementation(({ user }) => user);
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
      updatePractitionerUserInteractor(applicationContext, {
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
      updatePractitionerUserInteractor(applicationContext, {
        barNumber: 'AB1111',
        user: {
          ...mockPractitioner,
          barNumber: 'AB1111',
          updatedEmail: 'bc@example.com',
          userId: '9ea9732c-9751-4159-9619-bd27556eb9bc',
        },
      }),
    ).rejects.toThrow('Bar number does not match user data.');
  });

  it("should not set the practitioner's serviceIndicator to electronic when an email is added", async () => {
    mockPractitioner = {
      ...mockPractitioner,
      email: undefined,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    const updatedUser = await updatePractitionerUserInteractor(
      applicationContext,
      {
        barNumber: 'AB1111',
        user: {
          ...mockPractitioner,
          barNumber: 'AB2222',
          confirmEmail: 'bc@example.com',
          updatedEmail: 'bc@example.com',
        },
      },
    );

    expect(updatedUser.serviceIndicator).toBe(SERVICE_INDICATOR_TYPES.SI_PAPER);
  });

  it('updates the practitioner user and does NOT override a bar number or email when the original user had an email', async () => {
    const updatedUser = await updatePractitionerUserInteractor(
      applicationContext,
      {
        barNumber: 'AB1111',
        user: {
          ...mockPractitioner,
          barNumber: 'AB2222',
          confirmEmail: 'bc@example.com',
          updatedEmail: 'bc@example.com',
        },
      },
    );

    expect(updatedUser).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().updatePractitionerUser,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updatePractitionerUser.mock
        .calls[0][0],
    ).toMatchObject({ user: mockPractitioner });
  });

  it('updates the practitioner user and adds a pending email when the original user did not have an email', async () => {
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockResolvedValue({
        ...mockPractitioner,
        email: undefined,
      });

    const updatedUser = await updatePractitionerUserInteractor(
      applicationContext,
      {
        barNumber: 'AB1111',
        user: {
          ...mockPractitioner,
          confirmEmail: 'admissionsclerk@example.com',
          updatedEmail: 'admissionsclerk@example.com',
        },
      },
    );

    expect(updatedUser).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().createNewPractitionerUser,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().createNewPractitionerUser.mock
        .calls[0][0].user.pendingEmail,
    ).toEqual('admissionsclerk@example.com');
  });

  it('should update practitioner information when the practitioner does not have an email and is not updating their email', async () => {
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockResolvedValue({
        ...mockPractitioner,
        email: undefined,
      });

    await updatePractitionerUserInteractor(applicationContext, {
      barNumber: 'AB1111',
      user: {
        ...mockPractitioner,
        email: undefined,
        firstName: 'Donna',
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().updateUserRecords.mock.calls[0][0],
    ).toMatchObject({
      updatedUser: {
        ...mockPractitioner,
        email: undefined,
        firstName: 'Donna',
        name: 'Donna Attorney',
      },
    });
  });

  describe('updating email', () => {
    it('should throw unauthorized error when the logged in user does not have permission to manage emails', async () => {
      testUser = {
        role: ROLES.petitioner,
        userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
      };

      await expect(
        updatePractitionerUserInteractor(applicationContext, {
          user: mockPractitioner,
        }),
      ).rejects.toThrow('Unauthorized for updating practitioner user');
    });

    it('should throw an error when updatedEmail is not available in cognito', async () => {
      applicationContext
        .getPersistenceGateway()
        .isEmailAvailable.mockReturnValue(false);

      await expect(
        updatePractitionerUserInteractor(applicationContext, {
          user: {
            ...mockPractitioner,
            confirmEmail: 'exists@example.com',
            updatedEmail: 'exists@example.com',
          },
        }),
      ).rejects.toThrow('Email is not available');
    });

    it('should update the user with the new user.updatedEmail value', async () => {
      await updatePractitionerUserInteractor(applicationContext, {
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

    it("should send the verification email when the user's email is being changed", async () => {
      await updatePractitionerUserInteractor(applicationContext, {
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

    it("should NOT send the verification email when the user's email is being added for the first time", async () => {
      mockPractitioner.email = undefined;
      await updatePractitionerUserInteractor(applicationContext, {
        user: {
          ...mockPractitioner,
          confirmEmail: 'free-email-to-use@example.com',
          updatedEmail: 'free-email-to-use@example.com',
        },
      });

      expect(
        applicationContext.getUseCaseHelpers().sendEmailVerificationLink,
      ).not.toHaveBeenCalled();
    });

    it('should NOT call generateChangeOfAddress if ONLY the email is being updated', async () => {
      await updatePractitionerUserInteractor(applicationContext, {
        user: {
          ...mockPractitioner,
          confirmEmail: 'free-email-to-use@example.com',
          updatedEmail: 'free-email-to-use@example.com',
        },
      });

      expect(generateChangeOfAddress).not.toHaveBeenCalled();
    });

    it('should NOT call generateChangeOfAddress if ONLY the notes are being updated', async () => {
      await updatePractitionerUserInteractor(applicationContext, {
        user: {
          ...mockPractitioner,
          practitionerNotes: 'wow, real good notes',
        },
      });

      expect(generateChangeOfAddress).not.toHaveBeenCalled();
    });

    it('should NOT call generateChangeOfAddress if ONLY the notes and email are being updated', async () => {
      await updatePractitionerUserInteractor(applicationContext, {
        user: {
          ...mockPractitioner,
          confirmEmail: 'free-email-to-use@example.com',
          practitionerNotes: 'wow, real good notes',
          updatedEmail: 'free-email-to-use@example.com',
        },
      });

      expect(generateChangeOfAddress).not.toHaveBeenCalled();
    });

    it('should call generateChangeOfAddress if the email is being updated along with the address1', async () => {
      await updatePractitionerUserInteractor(applicationContext, {
        user: {
          ...mockPractitioner,
          confirmEmail: 'free-email-to-use@example.com',
          contact: {
            ...mockPractitioner.contact,
            address1: 'yeahhhhh',
          },
          updatedEmail: 'free-email-to-use@example.com',
        },
      });

      expect(generateChangeOfAddress).toHaveBeenCalled();
    });

    it('should call generateChangeOfAddress if the email is being updated along with the practitioner name', async () => {
      await updatePractitionerUserInteractor(applicationContext, {
        user: {
          ...mockPractitioner,
          confirmEmail: 'free-email-to-use@example.com',
          firstName: 'Helen',
          lastName: 'Hunt',
          updatedEmail: 'free-email-to-use@example.com',
        },
      });

      expect(generateChangeOfAddress).toHaveBeenCalled();
    });
  });
});
