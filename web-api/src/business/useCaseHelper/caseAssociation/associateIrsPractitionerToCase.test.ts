import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { associateIrsPractitionerToCase } from './associateIrsPractitionerToCase';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { irsPractitionerUser } from '@shared/test/mockUsers';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { verifyCaseForUser as verifyCaseForUserMock } from '@web-api/persistence/postgres/users/cases/verifyCaseForUser';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { associateUserWithCase as associateUserWithCaseMock } from '@web-api/persistence/postgres/users/cases/associateUserWithCase';

const associateUserWithCase = associateUserWithCaseMock as jest.Mock;
const verifyCaseForUser = verifyCaseForUserMock as jest.Mock;

describe('associateIrsPractitionerToCase', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
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
    status: CASE_STATUS_TYPES.new,
    userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
  };

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue(caseRecord);
  });

  it('should not add mapping when the user is already associated with the case', async () => {
    verifyCaseForUser.mockReturnValue(true);

    await associateIrsPractitionerToCase({
      applicationContext,
      authorizedUser: mockDocketClerkUser,
      docketNumber: caseRecord.docketNumber,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      user: irsPractitionerUser,
    });

    expect(associateUserWithCase).not.toHaveBeenCalled();
    expect(updateCaseAndAssociations).not.toHaveBeenCalled();
  });

  it('should add mapping for an irsPractitioner', async () => {
    verifyCaseForUser.mockReturnValue(false);

    await associateIrsPractitionerToCase({
      applicationContext,
      authorizedUser: mockDocketClerkUser,
      docketNumber: caseRecord.docketNumber,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      user: irsPractitionerUser,
    });

    expect(associateUserWithCase).toHaveBeenCalled();
    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate,
    ).toMatchObject({
      irsPractitioners: [
        {
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          userId: irsPractitionerUser.userId,
        },
      ],
    });
  });
});
