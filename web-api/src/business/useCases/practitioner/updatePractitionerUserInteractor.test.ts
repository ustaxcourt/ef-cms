import '@web-api/persistence/postgres/users/mocks.jest';
import { MOCK_PRACTITIONER } from '@shared/test/mockUsers';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { SERVICE_INDICATOR_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { generateChangeOfAddress } from '@web-api/business/useCases/user/generateChangeOfAddress';
jest.mock('@web-api/business/useCases/user/generateChangeOfAddress');
import {
  mockAdmissionsClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { updatePractitionerUser as updatePractitionerUserInteractor } from '@web-api/business/useCases/practitioner/updatePractitionerUserInteractor';
import { getPractitionerByBarNumber as getPractitionerByBarNumberMock } from '@web-api/persistence/postgres/users/getPractitionerByBarNumber';
import { updatePractitionerUser as updatePractitionerUserMock } from '@web-api/persistence/postgres/users/updatePractitionerUser';
import { createNewPractitionerUser as createNewPractitionerUserMock } from '@web-api/persistence/postgres/users/createNewPractitionerUser';
import { updateUser } from '@web-api/persistence/postgres/users/updateUser';

const getPractitionerByBarNumber = getPractitionerByBarNumberMock as jest.Mock;
const updatePractitionerUser = updatePractitionerUserMock as jest.Mock;
const createNewPractitionerUser = createNewPractitionerUserMock as jest.Mock;

describe('updatePractitionerUser', () => {
  let mockPractitioner = MOCK_PRACTITIONER;
  const clientConnectionId = 'c05024b1-f746-4360-a294-29179ac24ccd';

  beforeEach(() => {
    mockPractitioner = { ...MOCK_PRACTITIONER };
    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue(['123-23']);

    getPractitionerByBarNumber.mockImplementation(() => mockPractitioner);
    updatePractitionerUser.mockImplementation(({ user }) => user);
    createNewPractitionerUser.mockImplementation(({ user }) => user);

    applicationContext
      .getPersistenceGateway()
      .isEmailAvailable.mockReturnValue(true);
  });

  it('should throw an unauthorized error when the user does not have permission to update the practitioner user', async () => {
    await expect(
      updatePractitionerUserInteractor(
        applicationContext,
        {
          barNumber: 'pt101',
          user: mockPractitioner,
          clientConnectionId,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws a NotFoundError if the barNumber passed in does not find a user in the database', async () => {
    getPractitionerByBarNumber.mockResolvedValue(undefined);

    await expect(
      updatePractitionerUserInteractor(
        applicationContext,
        {
          barNumber: 'AB1111',
          bypassDocketEntry: false,
          clientConnectionId,
          user: {
            ...mockPractitioner,
            barNumber: 'AB1111',
            updatedEmail: 'bc@example.com',
            userId: '9ea9732c-9751-4159-9619-bd27556eb9bc',
          },
        },
        mockAdmissionsClerkUser,
      ),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws an error if the barNumber/userId combo passed in does not match the user retrieved from getPractitionerByBarNumber', async () => {
    getPractitionerByBarNumber.mockResolvedValue({
      ...mockPractitioner,
      userId: '2c14ebbc-a6e1-4267-b6b7-e329e592ec93',
    });

    await expect(
      updatePractitionerUserInteractor(
        applicationContext,
        {
          barNumber: 'AB1111',
          bypassDocketEntry: false,
          clientConnectionId,
          user: {
            ...mockPractitioner,
            barNumber: 'AB1111',
            updatedEmail: 'bc@example.com',
            userId: '9ea9732c-9751-4159-9619-bd27556eb9bc',
          },
        },
        mockAdmissionsClerkUser,
      ),
    ).rejects.toThrow('Bar number does not match user data.');
  });

  it("should not set the practitioner's serviceIndicator to electronic when an email is added", async () => {
    mockPractitioner = {
      ...mockPractitioner,
      email: undefined,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    await updatePractitionerUserInteractor(
      applicationContext,
      {
        barNumber: 'AB1111',
        clientConnectionId,
        user: {
          ...mockPractitioner,
          barNumber: 'AB2222',
          confirmEmail: 'bc@example.com',
          updatedEmail: 'bc@example.com',
        },
      },
      mockAdmissionsClerkUser,
    );

    expect(createNewPractitionerUser.mock.calls[0][0].user).toMatchObject({
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });
  });

  it('updates the practitioner user and does NOT override a bar number or email when the original user had an email', async () => {
    await updatePractitionerUserInteractor(
      applicationContext,
      {
        barNumber: 'AB1111',
        clientConnectionId,
        user: {
          ...mockPractitioner,
          barNumber: 'AB2222',
          confirmEmail: 'bc@example.com',
          updatedEmail: 'bc@example.com',
        },
      },
      mockAdmissionsClerkUser,
    );

    expect(updatePractitionerUser).toHaveBeenCalled();
    expect(updatePractitionerUser.mock.calls[0][0]).toMatchObject({
      user: mockPractitioner,
    });
  });

  it('updates the practitioner user and does NOT override a bar number when the original user has a pending email', async () => {
    mockPractitioner.email = undefined;
    mockPractitioner.pendingEmail = 'pendingEmail@example.com';

    await updatePractitionerUserInteractor(
      applicationContext,
      {
        barNumber: 'AB1111',
        clientConnectionId,
        user: {
          ...mockPractitioner,
          barNumber: 'AB2222',
          confirmEmail: 'bc@example.com',
          updatedEmail: 'bc@example.com',
        },
      },
      mockAdmissionsClerkUser,
    );

    expect(updatePractitionerUser).toHaveBeenCalled();
    expect(updatePractitionerUser.mock.calls[0][0]).toMatchObject({
      user: mockPractitioner,
    });
  });

  it('creates and updates the practitioner user and adds a pending email when the original user did not have an email', async () => {
    getPractitionerByBarNumber.mockResolvedValue({
      ...mockPractitioner,
      email: undefined,
    });

    await updatePractitionerUserInteractor(
      applicationContext,
      {
        barNumber: 'AB1111',
        clientConnectionId,
        user: {
          ...mockPractitioner,
          confirmEmail: 'admissionsclerk@example.com',
          updatedEmail: 'admissionsclerk@example.com',
        },
      },
      mockAdmissionsClerkUser,
    );

    expect(createNewPractitionerUser).toHaveBeenCalled();
    expect(
      createNewPractitionerUser.mock.calls[0][0].user.pendingEmail,
    ).toEqual('admissionsclerk@example.com');
  });

  it('should update practitioner information when the practitioner does not have an email and is not updating their email', async () => {
    getPractitionerByBarNumber.mockResolvedValue({
      ...mockPractitioner,
      email: undefined,
    });

    await updatePractitionerUserInteractor(
      applicationContext,
      {
        barNumber: 'AB1111',
        clientConnectionId,
        user: {
          ...mockPractitioner,
          email: undefined,
          firstName: 'Donna',
        },
      },
      mockAdmissionsClerkUser,
    );

    expect(await (updateUser as jest.Mock).mock.calls[0][0]).toMatchObject({
      userToUpdate: {
        ...mockPractitioner,
        email: undefined,
        firstName: 'Donna',
        name: 'Donna Attorney',
      },
    });
  });

  describe('updating email', () => {
    it('should throw unauthorized error when the logged in user does not have permission to manage emails', async () => {
      await expect(
        updatePractitionerUserInteractor(
          applicationContext,
          {
            barNumber: 'pt101',
            user: mockPractitioner,
            clientConnectionId,
          },
          mockPetitionerUser,
        ),
      ).rejects.toThrow('Unauthorized for updating practitioner user');
    });

    it('should throw an error when updatedEmail is not available in cognito', async () => {
      applicationContext
        .getPersistenceGateway()
        .isEmailAvailable.mockReturnValue(false);

      await expect(
        updatePractitionerUserInteractor(
          applicationContext,
          {
            barNumber: 'pt101',
            clientConnectionId,
            user: {
              ...mockPractitioner,
              confirmEmail: 'exists@example.com',
              updatedEmail: 'exists@example.com',
            },
          },
          mockAdmissionsClerkUser,
        ),
      ).rejects.toThrow('Email is not available');
    });

    it('should update the user with the new user.updatedEmail value', async () => {
      await updatePractitionerUserInteractor(
        applicationContext,
        {
          barNumber: 'pt101',
          clientConnectionId,
          user: {
            ...mockPractitioner,
            confirmEmail: 'free-email-to-use@example.com',
            updatedEmail: 'free-email-to-use@example.com',
          },
        },
        mockAdmissionsClerkUser,
      );

      expect(updatePractitionerUser.mock.calls[0][0].user).toMatchObject({
        pendingEmail: 'free-email-to-use@example.com',
        pendingEmailVerificationToken: expect.anything(),
      });
    });

    it("should send the verification email when the user's email is being changed", async () => {
      await updatePractitionerUserInteractor(
        applicationContext,
        {
          barNumber: 'pt101',
          clientConnectionId,
          user: {
            ...mockPractitioner,
            confirmEmail: 'free-email-to-use@example.com',
            updatedEmail: 'free-email-to-use@example.com',
          },
        },
        mockAdmissionsClerkUser,
      );

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
      await updatePractitionerUserInteractor(
        applicationContext,
        {
          barNumber: 'pt101',
          clientConnectionId,
          user: {
            ...mockPractitioner,
            confirmEmail: 'free-email-to-use@example.com',
            updatedEmail: 'free-email-to-use@example.com',
          },
        },
        mockAdmissionsClerkUser,
      );

      expect(
        applicationContext.getUseCaseHelpers().sendEmailVerificationLink,
      ).not.toHaveBeenCalled();
    });

    it('should NOT call generateChangeOfAddress if ONLY the email is being updated', async () => {
      await updatePractitionerUserInteractor(
        applicationContext,
        {
          barNumber: 'pt101',
          clientConnectionId,
          user: {
            ...mockPractitioner,
            confirmEmail: 'free-email-to-use@example.com',
            updatedEmail: 'free-email-to-use@example.com',
          },
        },
        mockAdmissionsClerkUser,
      );

      expect(generateChangeOfAddress).not.toHaveBeenCalled();
    });

    it('should NOT call generateChangeOfAddress if ONLY the notes are being updated', async () => {
      await updatePractitionerUserInteractor(
        applicationContext,
        {
          barNumber: 'pt101',
          clientConnectionId,
          user: {
            ...mockPractitioner,
            practitionerNotes: 'wow, real good notes',
          },
        },
        mockAdmissionsClerkUser,
      );

      expect(generateChangeOfAddress).not.toHaveBeenCalled();
    });

    it('should NOT call generateChangeOfAddress if ONLY the notes and email are being updated', async () => {
      await updatePractitionerUserInteractor(
        applicationContext,
        {
          barNumber: 'pt101',
          clientConnectionId,
          user: {
            ...mockPractitioner,
            confirmEmail: 'free-email-to-use@example.com',
            practitionerNotes: 'wow, real good notes',
            updatedEmail: 'free-email-to-use@example.com',
          },
        },
        mockAdmissionsClerkUser,
      );

      expect(generateChangeOfAddress).not.toHaveBeenCalled();
    });

    it('should call generateChangeOfAddress if the email is being updated along with the address1', async () => {
      await updatePractitionerUserInteractor(
        applicationContext,
        {
          barNumber: 'pt101',
          clientConnectionId,
          user: {
            ...mockPractitioner,
            confirmEmail: 'free-email-to-use@example.com',
            contact: {
              ...mockPractitioner.contact!,
              address1: 'yeahhhhh',
            },
            updatedEmail: 'free-email-to-use@example.com',
          },
        },
        mockAdmissionsClerkUser,
      );

      expect(generateChangeOfAddress).toHaveBeenCalled();
    });

    it('should call generateChangeOfAddress if the email is being updated along with the practitioner name', async () => {
      await updatePractitionerUserInteractor(
        applicationContext,
        {
          barNumber: 'pt101',
          clientConnectionId,
          user: {
            ...mockPractitioner,
            confirmEmail: 'free-email-to-use@example.com',
            firstName: 'Helen',
            lastName: 'Hunt',
            updatedEmail: 'free-email-to-use@example.com',
          },
        },
        mockAdmissionsClerkUser,
      );

      expect(generateChangeOfAddress).toHaveBeenCalled();
    });
  });
});
