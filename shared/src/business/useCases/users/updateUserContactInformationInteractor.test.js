const {
  ADMISSIONS_STATUS_OPTIONS,
  COUNTRY_TYPES,
  EMPLOYER_OPTIONS,
  PRACTITIONER_TYPE_OPTIONS,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  entityName: irsPractitionerEntityName,
} = require('../../entities/IrsPractitioner');
const {
  entityName: practitionerEntityName,
} = require('../../entities/Practitioner');
const {
  entityName: privatePractitionerEntityName,
} = require('../../entities/PrivatePractitioner');
const {
  updateUserContactInformationInteractor,
} = require('./updateUserContactInformationInteractor');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { UnauthorizedError } = require('../../../errors/errors');
jest.mock('./generateChangeOfAddress');
const { generateChangeOfAddress } = require('./generateChangeOfAddress');

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
      admissionsDate: new Date(),
      admissionsStatus: ADMISSIONS_STATUS_OPTIONS[0],
      birthYear: '1902',
      employer: EMPLOYER_OPTIONS[2],
      entityName: irsPractitionerEntityName,
      firstName: 'Roy',
      lastName: 'Rogers',
      originalBarState: 'OR',
      practitionerType: PRACTITIONER_TYPE_OPTIONS[0],
      role: ROLES.irsPractitioner,
    };

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
      updateUserContactInformationInteractor({
        applicationContext,
        contactInfo,
        userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw unauthorized error when the user attempts to modify contact information for a different user', async () => {
    await expect(
      updateUserContactInformationInteractor({
        applicationContext,
        contactInfo,
        userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should return without updating user or cases when the contact information has not changed', async () => {
    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo: {},
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });

    expect(applicationContext.getUseCases().updateUser).not.toBeCalled();
    expect(generateChangeOfAddress).not.toBeCalled();
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toBeCalledTimes(2);
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

    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: mockUser.userId,
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toBeCalledTimes(1);
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.action,
    ).toEqual('user_contact_update_error');
  });

  it('should update the user with the new contact information and mark it as having an update in progress', async () => {
    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });

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
      entityName: 'IrsPractitioner',
      isUpdatingInformation: true,
      name: 'IRS Practitioner',
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

    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });

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

    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });

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

    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });

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

    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toBeCalledTimes(1);
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
    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });

    expect(generateChangeOfAddress).toHaveBeenCalled();
  });

  it('should notify the user that the update is complete and mark the user as not having an update in progress', async () => {
    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toBeCalledTimes(2);
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
});
