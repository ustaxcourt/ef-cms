const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateUserContactInformationInteractor,
} = require('./updateUserContactInformationInteractor');
const { COUNTRY_TYPES, ROLES } = require('../../entities/EntityConstants');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { UnauthorizedError } = require('../../../errors/errors');
jest.mock('./generateChangeOfAddress');
const { generateChangeOfAddress } = require('./generateChangeOfAddress');

describe('updateUserContactInformationInteractor', () => {
  let user;

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
    user = MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f'];

    applicationContext.getCurrentUser.mockImplementation(() => user);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(async () => user);
    applicationContext
      .getPersistenceGateway()
      .updateUser.mockImplementation(() => {});
  });

  it('should throw unauthorized error when user does not have permission to update contact information', async () => {
    user = {
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

  it('should return without updating user or cases when the contact information for the user has an update in progress', async () => {
    user = { ...user, isUpdatingInformation: true };

    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });

    expect(applicationContext.getUseCases().updateUser).not.toBeCalled();
    expect(generateChangeOfAddress).not.toBeCalled();
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toBeCalledTimes(1);
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.action,
    ).toEqual('user_contact_update_in_progress');
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
      userId: user.userId,
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
      entityName: 'User',
      isUpdatingInformation: true,
      name: 'IRS Practitioner',
      role: 'irsPractitioner',
      section: 'irsPractitioner',
      token: undefined,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });
  });
  ('');

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
