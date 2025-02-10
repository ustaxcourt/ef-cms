import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { associateIrsPractitionerWithCaseInteractor } from './associateIrsPractitionerWithCaseInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { mockAdcUser, mockPetitionerUser } from '@shared/test/mockAuthUsers';
import { updateCase as updateCaseMock } from '@web-api/persistence/postgres/cases/updateCase';

describe('associateIrsPractitionerWithCaseInteractor', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCase = updateCaseMock as jest.Mock;

  const caseRecord = {
    caseCaption: 'Caption',
    caseType: CASE_TYPES_MAP.deficiency,
    docketEntries: MOCK_CASE.docketEntries,
    docketNumber: '123-19',
    filingType: 'Myself',
    partyType: PARTY_TYPES.petitioner,
    petitioners: [
      {
        address1: '123 Main St',
        city: 'Somewhere',
        contactType: CONTACT_TYPES.primary,
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'fieri@example.com',
        name: 'Roslindis Angelino',
        phone: '1234567890',
        postalCode: '12345',
        state: 'CA',
      },
    ],
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Regular',
    userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
  };

  let mockUserById;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => mockUserById);

    getCaseByDocketNumber.mockImplementation(() => caseRecord);
  });

  it('should throw an error when not authorized', async () => {
    await expect(
      associateIrsPractitionerWithCaseInteractor(
        applicationContext,
        {
          docketNumber: caseRecord.docketNumber,
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should add mapping for an irsPractitioner', async () => {
    mockUserById = {
      barNumber: 'BN1234',
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.irsPractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    await associateIrsPractitionerWithCaseInteractor(
      applicationContext,
      {
        docketNumber: caseRecord.docketNumber,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      mockAdcUser,
    );

    expect(updateCase).toHaveBeenCalled();
  });
});
