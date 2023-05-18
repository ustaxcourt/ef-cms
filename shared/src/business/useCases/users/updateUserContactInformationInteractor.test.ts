import {
  ADMISSIONS_STATUS_OPTIONS,
  COUNTRY_TYPES,
  EMPLOYER_OPTIONS,
  PRACTITIONER_TYPE_OPTIONS,
  ROLES,
} from '../../entities/EntityConstants';
import { MOCK_USERS } from '../../../test/mockUsers';
import { UnauthorizedError } from '../../../errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { entityName as irsPractitionerEntityName } from '../../entities/IrsPractitioner';
import { entityName as practitionerEntityName } from '../../entities/Practitioner';
import { entityName as privatePractitionerEntityName } from '../../entities/PrivatePractitioner';
import { updateUserContactInformationInteractor } from './updateUserContactInformationInteractor';

jest.mock('./generateChangeOfAddress');
import { generateChangeOfAddress } from './generateChangeOfAddress';

describe('updateUserContactInformationInteractor', () => {
  let mockUser;

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
      ...MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f'],
      admissionsDate: '2020-03-14',
      admissionsStatus: ADMISSIONS_STATUS_OPTIONS[0],
      birthYear: '1902',
      employer: EMPLOYER_OPTIONS[2],
      entityName: irsPractitionerEntityName,
      firmName: 'broken',
      firstName: 'Roy',
      lastName: 'Rogers',
      originalBarState: 'OR',
      practitionerType: PRACTITIONER_TYPE_OPTIONS[0],
      role: ROLES.irsPractitioner,
    };

    applicationContext
      .getPersistenceGateway()
      .getCasesByUserId.mockReturnValue();
    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => mockUser);
    applicationContext
      .getPersistenceGateway()
      .updateUser.mockImplementation(() => {});
  });

  it('should throw unauthorized error when user does not have permission to update contact information', async () => {
    mockUser = {
      role: ROLES.petitionsClerk,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    };

    await expect(
      updateUserContactInformationInteractor(applicationContext, {
        contactInfo,
        userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
      } as any),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw unauthorized error when the user attempts to modify contact information for a different user', async () => {
    await expect(
      updateUserContactInformationInteractor(applicationContext, {
        contactInfo,
        userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
      } as any),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should return without updating user or cases when the contact information has not changed', async () => {
    await updateUserContactInformationInteractor(applicationContext, {
      contactInfo: {},
      firmName: 'broken',
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });

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
  });

  it('should throw an error when updateUser throws an error', async () => {
    applicationContext
      .getPersistenceGateway()
      .updateUser.mockImplementation(() => {
        throw new Error('something wicked');
      });

    await expect(
      updateUserContactInformationInteractor(applicationContext, {
        contactInfo,
        userId: mockUser.userId,
      } as any),
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
      ...MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f'],
      admissionsDate: '2020-03-14',
      admissionsStatus: ADMISSIONS_STATUS_OPTIONS[0],
      birthYear: '1902',
      employer: EMPLOYER_OPTIONS[1],
      entityName: irsPractitionerEntityName,
      firstName: 'Test',
      lastName: 'IRS Practitioner',
      originalBarState: 'OR',
      practitionerType: PRACTITIONER_TYPE_OPTIONS[0],
      role: ROLES.irsPractitioner,
    };
    await updateUserContactInformationInteractor(applicationContext, {
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    } as any);

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
      email: undefined,
      entityName: practitionerEntityName,
      isUpdatingInformation: true,
      name: 'Test IRS Practitioner',
      role: 'irsPractitioner',
      token: undefined,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });
  });

  it('should update the user when the user being updated is a privatePractitioner', async () => {
    mockUser = {
      ...mockUser,
      entityName: privatePractitionerEntityName,
      role: ROLES.privatePractitioner,
    };

    await updateUserContactInformationInteractor(applicationContext, {
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    } as any);

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[1][0].message.action,
    ).toEqual('user_contact_full_update_complete');
    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[1][0]
        .user,
    ).toMatchObject({
      isUpdatingInformation: false,
    });
  });

  it('should update the user when the user being updated is a irsPractitioner', async () => {
    mockUser = {
      ...mockUser,
      entityName: irsPractitionerEntityName,
      role: ROLES.irsPractitioner,
    };

    await updateUserContactInformationInteractor(applicationContext, {
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    } as any);

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[1][0].message.action,
    ).toEqual('user_contact_full_update_complete');
    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[1][0]
        .user,
    ).toMatchObject({
      isUpdatingInformation: false,
    });
  });

  it('should update the user when the user being updated is a practitioner', async () => {
    mockUser = {
      ...mockUser,
      entityName: practitionerEntityName,
      role: ROLES.privatePractitioner,
    };

    await updateUserContactInformationInteractor(applicationContext, {
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    } as any);

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[1][0].message.action,
    ).toEqual('user_contact_full_update_complete');
    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[1][0]
        .user,
    ).toMatchObject({
      isUpdatingInformation: false,
    });
  });

  it('should notify and not update the user when the user being updated is not a privatePractitioner, irsPractitioner, or practitioner', async () => {
    mockUser = {
      ...mockUser,
      entityName: 'notapractitioner',
    };

    await expect(
      updateUserContactInformationInteractor(applicationContext, {
        contactInfo,
        userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
      } as any),
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
    await updateUserContactInformationInteractor(applicationContext, {
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    } as any);

    expect(generateChangeOfAddress).toHaveBeenCalled();
  });

  it('should notify the user that the update is complete and mark the user as not having an update in progress', async () => {
    await updateUserContactInformationInteractor(applicationContext, {
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    } as any);

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[1][0].message.action,
    ).toEqual('user_contact_full_update_complete');
    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[1][0]
        .user,
    ).toMatchObject({
      isUpdatingInformation: false,
    });
  });

  it('should update the firmName if user is a practitioner and firmName is passed in', async () => {
    await updateUserContactInformationInteractor(applicationContext, {
      contactInfo,
      firmName: 'testing',
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });
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

    await updateUserContactInformationInteractor(applicationContext, {
      contactInfo,
      firmName: mockUser.firmName,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });

    expect(
      applicationContext.getPersistenceGateway().updateUser,
    ).not.toHaveBeenCalled();
  });
});
