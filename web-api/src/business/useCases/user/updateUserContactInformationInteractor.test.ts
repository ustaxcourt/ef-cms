import '@web-api/persistence/postgres/practitioners/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import {
  ADMISSIONS_STATUS_OPTIONS,
  COUNTRY_TYPES,
  PRACTICE_TYPE_OPTIONS,
  PRACTITIONER_TYPE_OPTIONS,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { irsPractitionerUser } from '@shared/test/mockUsers';
import { updateUserContactInformation } from './updateUserContactInformationInteractor';
jest.mock('./generateChangeOfAddress');
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { generateChangeOfAddress } from './generateChangeOfAddress';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';
import { getCasesForUser as getCasesForUserMock } from '@web-api/persistence/postgres/users/cases/getCasesForUser';
import { updatePractitioner as updatePractitionerMock } from '@web-api/persistence/postgres/practitioners/updatePractitioner';
import { getPractitionerById as getPractitionerByIdMock } from '@web-api/persistence/postgres/practitioners/getPractitionerById';
import { updateUser as updateUserMock } from '@web-api/persistence/postgres/users/updateUser';

const getCasesForUser = getCasesForUserMock as jest.Mock;
const updatePractitioner = updatePractitionerMock as jest.Mock;
const getPractitionerById = getPractitionerByIdMock as jest.Mock;
const updateUser = updateUserMock as jest.Mock;

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

    getCasesForUser.mockReturnValue(undefined);
    getPractitionerById.mockResolvedValue(mockUser);
    updatePractitioner.mockResolvedValue({});
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

    expect(updateUser).not.toHaveBeenCalled();
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

    expect(updateUser.mock.calls[0][0].userToUpdate).toMatchObject({
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

    expect(updateUser.mock.calls[0][0].userToUpdate).toMatchObject({
      isUpdatingInformation: true,
    });
  });

  it('should notify and not update the user when the user being updated is not a privatePractitioner, irsPractitioner, or petitioner', async () => {
    getPractitionerById.mockResolvedValue({
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

    expect(updateUser.mock.calls[1][0].isUpdatingInformation).not.toBeDefined();

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

    expect(updateUser.mock.calls.length).toEqual(1);

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
    expect(updateUser.mock.calls[0][0].userToUpdate).toMatchObject({
      firmName: 'testing',
    });
  });

  it('should return early if the firmName and contact info was not changed', async () => {
    getPractitionerById.mockImplementation(() => ({
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

    expect(updateUser).not.toHaveBeenCalled();
  });

  it('should throw an error when updateUser throws an error', async () => {
    updateUser.mockImplementation(() => {
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
});
