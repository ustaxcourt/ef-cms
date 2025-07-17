jest.mock('@web-api/persistence/postgres/users/upsertUsers');
jest.mock('@web-api/persistence/postgres/users/getUserById');
jest.mock('./generateChangeOfAddress');
import {
  ADMISSIONS_STATUS_OPTIONS,
  COUNTRY_TYPES,
  PRACTICE_TYPE_OPTIONS,
  PRACTITIONER_TYPE_OPTIONS,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { irsPractitionerUser } from '../../../../../shared/src/test/mockUsers';
import { updateUserContactInformation } from './updateUserContactInformationInteractor';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { generateChangeOfAddress as generateChangeOfAddressMock } from './generateChangeOfAddress';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';
import { upsertUsers as upsertUsersMock } from '@web-api/persistence/postgres/users/upsertUsers';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';

describe('updateUserContactInformation', () => {
  const getUserById = jest.mocked(getUserByIdMock);
  const upsertUsers = jest.mocked(upsertUsersMock);
  const generateChangeOfAddress = jest.mocked(generateChangeOfAddressMock);
  let mockUser;
  const clientConnectionId = '384048';

  const contactInfo = {
    address1: '234 Main St',
    address2: 'Apartment 4',
    address3: 'Under the stairs',
    city: 'Chicago',
    country: 'Brazil',
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    phone: '+1 (555) 555-5555',
    postalCode: '61234',
    state: 'IL',
  };

  beforeEach(() => {
    mockUser = {
      ...irsPractitionerUser,
      admissionsDate: '2020-03-14',
      admissionsStatus: ADMISSIONS_STATUS_OPTIONS[0],
      birthYear: '1902',
      entityName: IrsPractitioner.ENTITY_NAME,
      firmName: 'broken',
      firstName: 'Roy',
      lastName: 'Rogers',
      originalBarState: 'OR',
      practiceType: PRACTICE_TYPE_OPTIONS[2],
      practitionerType: PRACTITIONER_TYPE_OPTIONS[0],
      role: ROLES.irsPractitioner,
    };

    applicationContext
      .getPersistenceGateway()
      .getCasesByUserId.mockReturnValue();

    getUserById.mockResolvedValue(mockUser);
    upsertUsers.mockResolvedValue();
  });

  it('should throw unauthorized error when user does not have permission to update contact information', async () => {
    mockUser = mockPetitionsClerkUser;

    await expect(
      updateUserContactInformation(
        applicationContext,
        {
          contactInfo,
          userId: mockUser.userId,
        } as any,
        mockUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw unauthorized error when the user attempts to modify contact information for a different user', async () => {
    await expect(
      updateUserContactInformation(
        applicationContext,
        {
          contactInfo,
          userId: 'asdf1234-f6cd-442c-a168-202db587f16f',
        } as any,
        mockUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should return without updating user or cases when the contact information has not changed', async () => {
    await updateUserContactInformation(
      applicationContext,
      {
        contactInfo: mockUser.contact,
        firmName: 'broken',
        userId: mockUser.userId,
        clientConnectionId,
      },
      mockUser,
    );

    expect(upsertUsers).not.toHaveBeenCalled();
    expect(generateChangeOfAddress).not.toHaveBeenCalled();
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.action,
    ).toEqual('user_contact_initial_update_complete');
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[1][0].message.action,
    ).toEqual('user_contact_full_update_complete');

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[1][0].message.user,
    ).toBeDefined();
  });

  it('should throw an error when updateUser throws an error', async () => {
    upsertUsers.mockImplementation(() => {
      throw new Error('something wicked');
    });

    await expect(
      updateUserContactInformation(
        applicationContext,
        {
          contactInfo,
          userId: mockUser.userId,
        } as any,
        mockUser,
      ),
    ).rejects.toThrow('something wicked');

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.action,
    ).toEqual('user_contact_update_error');
  });

  it('should update the user with the new contact information and mark it as having an update in progress', async () => {
    mockUser = {
      ...irsPractitionerUser,
      admissionsDate: '2020-03-14',
      admissionsStatus: ADMISSIONS_STATUS_OPTIONS[0],
      birthYear: '1902',
      entityName: IrsPractitioner.ENTITY_NAME,
      firstName: 'Test',
      lastName: 'IRS Practitioner',
      originalBarState: 'OR',
      practiceType: PRACTICE_TYPE_OPTIONS[1],
      practitionerType: PRACTITIONER_TYPE_OPTIONS[0],
      role: ROLES.irsPractitioner,
    };
    await updateUserContactInformation(
      applicationContext,
      {
        contactInfo,
        userId: mockUser.userId,
      } as any,
      mockUser,
    );

    expect(upsertUsers.mock.calls[0][0][0]).toMatchObject({
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        country: 'Brazil',
        countryType: 'international',
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      entityName: Practitioner.ENTITY_NAME,
      isUpdatingInformation: true,
      token: undefined,
      userId: mockUser.userId,
    });
  });

  it('should update the user when the user being updated is a irsPractitioner', async () => {
    mockUser = {
      ...mockUser,
      entityName: IrsPractitioner.ENTITY_NAME,
      role: ROLES.irsPractitioner,
    };

    await updateUserContactInformation(
      applicationContext,
      {
        contactInfo,
        userId: mockUser.userId,
      } as any,
      mockUser,
    );

    expect(upsertUsers.mock.calls[0][0][0]).toMatchObject({
      isUpdatingInformation: true,
    });
  });

  it('should notify and not update the user when the user being updated is not a privatePractitioner, irsPractitioner, or petitioner', async () => {
    getUserById.mockResolvedValue({
      ...mockUser,
      role: 'notapractitioner',
    });

    await expect(
      updateUserContactInformation(
        applicationContext,
        {
          contactInfo,
          userId: mockUser.userId,
        } as any,
        mockUser,
      ),
    ).rejects.toThrow();

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.action,
    ).toEqual('user_contact_update_error');
    expect(
      JSON.stringify(
        applicationContext.getNotificationGateway().sendNotificationToUser.mock
          .calls[0][0].message.error,
      ),
    ).toContain('Error: Unrecognized role notapractitioner');
  });

  it('should generate a change of address document', async () => {
    await updateUserContactInformation(
      applicationContext,
      {
        contactInfo,
        userId: mockUser.userId,
      } as any,
      mockUser,
    );

    expect(generateChangeOfAddress).toHaveBeenCalled();
  });

  it('should clean up DB and send websocket message if "generateChangeOfAddress" returns empty array', async () => {
    generateChangeOfAddress.mockResolvedValue([]);

    await updateUserContactInformation(
      applicationContext,
      {
        contactInfo,
        userId: mockUser.userId,
      } as any,
      mockUser,
    );

    expect(upsertUsers.mock.calls[1][0][0].isUpdatingInformation).toEqual(
      false,
    );
    const notificationCalls =
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls;

    expect(
      notificationCalls[notificationCalls.length - 1][0].message.action,
    ).toEqual('user_contact_full_update_complete');

    expect(
      notificationCalls[notificationCalls.length - 1][0].message.user,
    ).toMatchObject({
      contact: contactInfo,
    });
  });

  it('should not clean up DB and send websocket message if "generateChangeOfAddress" returns undefined', async () => {
    generateChangeOfAddress.mockResolvedValue(undefined);

    await updateUserContactInformation(
      applicationContext,
      {
        contactInfo,
        userId: mockUser.userId,
      } as any,
      mockUser,
    );

    expect(upsertUsers.mock.calls.length).toEqual(1);

    const notificatsionCalls =
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls;

    expect(
      notificatsionCalls[notificatsionCalls.length - 1][0].message.action,
    ).not.toEqual('user_contact_full_update_complete');
  });

  it('should update the firmName if user is a practitioner and firmName is passed in', async () => {
    await updateUserContactInformation(
      applicationContext,
      {
        contactInfo,
        firmName: 'testing',
        userId: mockUser.userId,
        clientConnectionId,
      },
      mockUser,
    );
    expect(upsertUsers.mock.calls[0][0][0]).toMatchObject({
      firmName: 'testing',
    });
  });

  it('should return early if the firmName and contact info was not changed', async () => {
    getUserById.mockImplementation(() => ({
      ...mockUser,
      contact: contactInfo,
    }));

    await updateUserContactInformation(
      applicationContext,
      {
        contactInfo,
        firmName: mockUser.firmName,
        userId: mockUser.userId,
        clientConnectionId,
      },
      mockUser,
    );

    expect(upsertUsers).not.toHaveBeenCalled();
  });
});
