import '@web-api/persistence/postgres/users/mocks.jest';
import { MOCK_PRACTITIONER } from '../../../../../shared/src/test/mockUsers';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { SERVICE_INDICATOR_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateChangeOfAddress } from '@web-api/business/useCases/user/generateChangeOfAddress';
import {
  mockAdmissionsClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { updatePractitionerUser } from './updatePractitionerUserInteractor';
import { getPractitionerByBarNumber as getPractitionerByBarNumberMock } from '@web-api/persistence/postgres/users/getPractitionerByBarNumber';
jest.mock('@web-api/business/useCases/user/generateChangeOfAddress');
import { upsertUsers as upsertUsersMock } from '@web-api/persistence/postgres/users/upsertUsers';
import { getDocketNumbersByUser as getDocketNumbersByUserMock } from '@web-api/persistence/postgres/users/getDocketNumbersByUser';
import { upsertPractitioner as upsertPractitionerMock } from '@web-api/persistence/postgres/users/upsertPractitioner';

describe('updatePractitionerUser', () => {
  let mockPractitioner = MOCK_PRACTITIONER;
  const clientConnectionId = 'c05024b1-f746-4360-a294-29179ac24ccd';
  const getPractitionerByBarNumber = jest.mocked(
    getPractitionerByBarNumberMock,
  );
  const upsertUsers = jest.mocked(upsertUsersMock);
  const getDocketNumbersByUser = jest.mocked(getDocketNumbersByUserMock);
  const upsertPractitioner = jest.mocked(upsertPractitionerMock);

  beforeEach(() => {
    mockPractitioner = { ...MOCK_PRACTITIONER };
    getDocketNumbersByUser.mockResolvedValue(['123-23']);
    getPractitionerByBarNumber.mockResolvedValue(mockPractitioner);
    upsertPractitioner.mockImplementation(({ user }) =>
      Promise.resolve({ ...user, userId: 'theId' }),
    );
    applicationContext
      .getPersistenceGateway()
      .updatePractitionerUser.mockImplementation(({ user }) => user);
    applicationContext
      .getPersistenceGateway()
      .isEmailAvailable.mockReturnValue(true);
    applicationContext
      .getUseCases()
      .getPractitionerCasesInteractor.mockReturnValue({
        closedCases: [],
        openCases: [],
      });
  });

  it('should throw an unauthorized error when the user does not have permission to update the practitioner user', async () => {
    await expect(
      updatePractitionerUser(
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
      updatePractitionerUser(
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
      updatePractitionerUser(
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

    await updatePractitionerUser(
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

    expect(
      applicationContext.getPersistenceGateway().updatePractitionerUser.mock
        .calls[0][0].user,
    ).toMatchObject({
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });
  });

  it('updates the practitioner user and does NOT override a bar number or email when the original user had an email', async () => {
    await updatePractitionerUser(
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

    expect(
      applicationContext.getPersistenceGateway().updatePractitionerUser.mock
        .calls[0][0].user,
    ).toMatchObject(mockPractitioner);
  });

  it('updates the practitioner user and does NOT override a bar number when the original user has a pending email', async () => {
    mockPractitioner.email = undefined;
    mockPractitioner.pendingEmail = 'pendingEmail@example.com';

    await updatePractitionerUser(
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

    expect(
      applicationContext.getPersistenceGateway().updatePractitionerUser.mock
        .calls[0][0].user,
    ).toMatchObject(mockPractitioner);
  });

  it('creates and updates the practitioner user and adds a pending email when the original user did not have an email', async () => {
    getPractitionerByBarNumber.mockResolvedValue({
      ...mockPractitioner,
      email: undefined,
    });

    await updatePractitionerUser(
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

    expect(upsertPractitioner.mock.calls[0][0].user.pendingEmail).toEqual(
      'admissionsclerk@example.com',
    );
  });

  it('should update practitioner information when the practitioner does not have an email and is not updating their email', async () => {
    getPractitionerByBarNumber.mockResolvedValue({
      ...mockPractitioner,
      email: undefined,
    });

    await updatePractitionerUser(
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

    expect(upsertUsers.mock.calls[0][0]).toMatchObject([
      {
        ...mockPractitioner,
        email: undefined,
        firstName: 'Donna',
        name: 'Donna Attorney',
      },
    ]);
  });

  describe('updating email', () => {
    it('should throw unauthorized error when the logged in user does not have permission to manage emails', async () => {
      await expect(
        updatePractitionerUser(
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
        updatePractitionerUser(
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
      await updatePractitionerUser(
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
        applicationContext.getPersistenceGateway().updatePractitionerUser.mock
          .calls[0][0].user,
      ).toMatchObject({
        pendingEmail: 'free-email-to-use@example.com',
        pendingEmailVerificationToken: expect.anything(),
      });
    });

    it("should send the verification email when the user's email is being changed", async () => {
      await updatePractitionerUser(
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
      await updatePractitionerUser(
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
      await updatePractitionerUser(
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
      await updatePractitionerUser(
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
      await updatePractitionerUser(
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
      await updatePractitionerUser(
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
      getPractitionerByBarNumber.mockResolvedValue(mockPractitioner);
      await updatePractitionerUser(
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

  describe('update practiceType', () => {
    it('should throw error when practitioner has open cases and practice type has been changed', async () => {
      getPractitionerByBarNumber.mockResolvedValue({
        ...mockPractitioner,
        userId: 'dabbad03-18d0-43ec-bafb-654e83405416',
        practiceType: 'DOJ',
      });
      applicationContext
        .getUseCases()
        .getPractitionerCasesInteractor.mockReturnValue({
          closedCases: [],
          openCases: ['practitioner'],
        });
      await expect(
        updatePractitionerUser(
          applicationContext,
          {
            barNumber: 'AB1111',
            bypassDocketEntry: false,
            clientConnectionId,
            user: {
              ...mockPractitioner,
              barNumber: 'AB1111',
              updatedEmail: 'bc@example.com',
              userId: 'dabbad03-18d0-43ec-bafb-654e83405416',
              practiceType: 'IRS',
            },
          },
          mockAdmissionsClerkUser,
        ),
      ).rejects.toThrow(
        'Practitioner is associated with one or more open cases. Practitioner has to be withdrawn from all open cases to change practice type.',
      );
    });
    it('should not throw an error when the practice type changed and there are no open cases', async () => {
      getPractitionerByBarNumber.mockResolvedValue({
        ...mockPractitioner,
        userId: '9ea9732c-9751-4159-9619-bd27556eb9bc',
        practiceType: 'DOJ',
      });
      applicationContext
        .getUseCases()
        .getPractitionerCasesInteractor.mockReturnValue({
          closedCases: ['practitioner'],
          openCases: [],
        });
      await expect(
        updatePractitionerUser(
          applicationContext,
          {
            barNumber: 'AB1111',
            bypassDocketEntry: false,
            clientConnectionId,
            user: {
              ...mockPractitioner,
              barNumber: 'AB1111',
              userId: '9ea9732c-9751-4159-9619-bd27556eb9bc',
              practiceType: 'IRS',
            },
          },
          mockAdmissionsClerkUser,
        ),
      ).resolves.not.toThrow();
    });
  });
});
