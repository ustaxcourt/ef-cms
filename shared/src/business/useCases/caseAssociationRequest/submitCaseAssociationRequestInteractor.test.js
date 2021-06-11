const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  submitCaseAssociationRequestInteractor,
} = require('./submitCaseAssociationRequestInteractor');
const { COUNTRY_TYPES, ROLES } = require('../../entities/EntityConstants');
const { getContactPrimary } = require('../../entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase.js');

describe('submitCaseAssociationRequest', () => {
  const mockContactId = getContactPrimary(MOCK_CASE).contactId;

  let mockCurrentUser;
  let mockGetUserById;

  beforeAll(() => {
    applicationContext.getCurrentUser.mockImplementation(() => mockCurrentUser);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => mockGetUserById);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => MOCK_CASE);
  });

  it('should throw an error when not authorized', async () => {
    mockCurrentUser = {
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.adc,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    await expect(
      submitCaseAssociationRequestInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should not add mapping if already there', async () => {
    mockCurrentUser = {
      barNumber: 'BN1234',
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
    mockGetUserById = {
      barNumber: 'BN1234',
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        countryType: COUNTRY_TYPES.DOMESTIC,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);

    await submitCaseAssociationRequestInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      representing: [mockContactId],
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).not.toBeCalled();
  });

  it('should add mapping for a practitioner', async () => {
    mockCurrentUser = {
      barNumber: 'BN1234',
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        countryType: COUNTRY_TYPES.DOMESTIC,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    await submitCaseAssociationRequestInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      filers: [mockContactId],
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).toBeCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toBeCalled();
  });

  it('should add mapping for an irsPractitioner', async () => {
    mockCurrentUser = {
      barNumber: 'BN1234',
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.irsPractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
    mockGetUserById = {
      barNumber: 'BN1234',
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        countryType: COUNTRY_TYPES.DOMESTIC,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.irsPractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    await submitCaseAssociationRequestInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).toBeCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toBeCalled();
  });
});
