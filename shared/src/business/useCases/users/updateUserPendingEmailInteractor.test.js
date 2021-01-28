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
  updateUserPendingEmailInteractor,
} = require('./updateUserPendingEmailInteractor');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { UnauthorizedError } = require('../../../errors/errors');
const { validUser } = require('../../entities/User.test');
jest.mock('./generateChangeOfAddress');
const { generateChangeOfAddress } = require('./generateChangeOfAddress');

describe('updateUserPendingEmailInteractor', () => {
  const pendingEmail = 'hello@example.com';
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
    mockUser = { ...validUser, role: ROLES.privatePractitioner };

    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => mockUser);
    applicationContext
      .getPersistenceGateway()
      .updateUser.mockImplementation(() => mockUser);
  });

  it('should throw unauthorized error when user does not have permission to manage emails', async () => {
    mockUser = {
      role: ROLES.petitionsClerk,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    };

    await expect(
      updateUserPendingEmailInteractor({
        applicationContext,
        pendingEmail,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should make a call to get the current user', async () => {
    await updateUserPendingEmailInteractor({
      applicationContext,
      pendingEmail,
    });

    expect(applicationContext.getCurrentUser).toHaveBeenCalled();
  });

  it('should make a call to getUserById with the logged in user.userId', async () => {
    await updateUserPendingEmailInteractor({
      applicationContext,
      pendingEmail,
    });

    expect(
      applicationContext.getPersistenceGateway().getUserById.mock.calls[0][0],
    ).toMatchObject({ userId: mockUser.userId });
  });

  it('should update the user record in persistence with the pendingEmail value', async () => {
    await updateUserPendingEmailInteractor({
      applicationContext,
      pendingEmail,
    });

    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
        .user,
    ).toMatchObject({ pendingEmail });
  });
});
