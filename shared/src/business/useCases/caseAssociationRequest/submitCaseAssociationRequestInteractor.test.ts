import { COUNTRY_TYPES, ROLES } from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getContactPrimary } from '../../entities/cases/Case';
import { submitCaseAssociationRequestInteractor } from './submitCaseAssociationRequestInteractor';

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
        filers: [],
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
      filers: [],
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).not.toHaveBeenCalled();
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
    });

    expect(
      applicationContext.getUseCaseHelpers().associatePrivatePractitionerToCase,
    ).toHaveBeenCalled();
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
      filers: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
    });

    expect(
      applicationContext.getUseCaseHelpers().associateIrsPractitionerToCase,
    ).toHaveBeenCalled();
  });
});
