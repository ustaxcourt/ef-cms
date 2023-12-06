import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { associateIrsPractitionerToCase } from './associateIrsPractitionerToCase';
import { docketClerkUser, irsPractitionerUser } from '../../../test/mockUsers';

describe('associateIrsPractitionerToCase', () => {
  let caseRecord1 = {
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
        name: 'Guy Fieri',
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
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(caseRecord1);
  });

  it('should not add mapping when the user is already associated with the case', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);

    await associateIrsPractitionerToCase({
      applicationContext,
      docketNumber: caseRecord1.docketNumber,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      user: irsPractitionerUser,
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).not.toHaveBeenCalled();
  });

  it('should add mapping for an irsPractitioner', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    await associateIrsPractitionerToCase({
      applicationContext,
      docketNumber: caseRecord1.docketNumber,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      user: irsPractitionerUser,
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate,
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
