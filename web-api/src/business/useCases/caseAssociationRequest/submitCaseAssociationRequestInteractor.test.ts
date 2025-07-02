import '@web-api/persistence/postgres/practitioners/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import {
  COUNTRY_TYPES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getContactPrimary } from '@shared/business/entities/cases/Case';
import {
  mockAdcUser,
  mockIrsPractitionerUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import { submitCaseAssociationRequestInteractor } from './submitCaseAssociationRequestInteractor';
import { getPractitionerById as getPractitionerByIdMock } from '@web-api/persistence/postgres/practitioners/getPractitionerById';
import { Practitioner } from '@shared/business/entities/Practitioner';

const getPractitionerById = getPractitionerByIdMock as jest.Mock;

describe('submitCaseAssociationRequest', () => {
  const mockContactId = getContactPrimary(MOCK_CASE).contactId;

  let mockPractitionerData;

  beforeAll(() => {
    getPractitionerById.mockImplementation(
      () => new Practitioner(mockPractitionerData),
    );

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => MOCK_CASE);
  });

  it('should throw an error when not authorized', async () => {
    await expect(
      submitCaseAssociationRequestInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
          filers: [],
        },
        mockAdcUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should not add mapping if already there', async () => {
    mockPractitionerData = {
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
      name: mockPrivatePractitionerUser.name,
      role: ROLES.privatePractitioner,
      userId: mockPrivatePractitionerUser.userId,
    };
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);

    await submitCaseAssociationRequestInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        filers: [],
      },
      mockPrivatePractitionerUser,
    );

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).not.toHaveBeenCalled();
  });

  it('should add mapping for a practitioner', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    await submitCaseAssociationRequestInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        filers: [mockContactId],
      },
      mockPrivatePractitionerUser,
    );

    expect(
      applicationContext.getUseCaseHelpers().associatePrivatePractitionerToCase,
    ).toHaveBeenCalled();
  });

  it('should add mapping for an irsPractitioner', async () => {
    mockPractitionerData = {
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
      name: mockIrsPractitionerUser.name,
      role: ROLES.irsPractitioner,
      userId: mockIrsPractitionerUser,
    };
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    await submitCaseAssociationRequestInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        filers: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
      },
      mockIrsPractitionerUser,
    );

    expect(
      applicationContext.getUseCaseHelpers().associateIrsPractitionerToCase,
    ).toHaveBeenCalled();
  });
});
