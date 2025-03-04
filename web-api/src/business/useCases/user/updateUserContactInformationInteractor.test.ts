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
jest.mock('./generateChangeOfAddress');
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { generateChangeOfAddress } from './generateChangeOfAddress';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';

describe('updateUserContactInformation', () => {
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

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockResolvedValue(mockUser);

    applicationContext.getPersistenceGateway().updateUser.mockResolvedValue({});
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

    expect(applicationContext.getUseCases().updateUser).not.toHaveBeenCalled();
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
    applicationContext
      .getPersistenceGateway()
      .updateUser.mockImplementation(() => {
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

    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
        .user,
    ).toMatchObject({
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

    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
        .user,
    ).toMatchObject({
      isUpdatingInformation: true,
    });
  });

  it('should notify and not update the user when the user being updated is not a privatePractitioner, irsPractitioner, or petitioner', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      ...mockUser,
      entityName: 'notapractitioner',
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
    ).toContain('Error: Unrecognized entityType notapractitioner');
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
    (generateChangeOfAddress as jest.Mock).mockReturnValue([]);

    await updateUserContactInformation(
      applicationContext,
      {
        contactInfo,
        userId: mockUser.userId,
      } as any,
      mockUser,
    );

    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[1][0]
        .isUpdatingInformation,
    ).not.toBeDefined();

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
    (generateChangeOfAddress as jest.Mock).mockReturnValue(undefined);

    await updateUserContactInformation(
      applicationContext,
      {
        contactInfo,
        userId: mockUser.userId,
      } as any,
      mockUser,
    );

    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls.length,
    ).toEqual(1);

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
    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
        .user,
    ).toMatchObject({
      firmName: 'testing',
    });
  });

  it('should return early if the firmName and contact info was not changed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => ({
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

    expect(
      applicationContext.getPersistenceGateway().updateUser,
    ).not.toHaveBeenCalled();
  });
});
