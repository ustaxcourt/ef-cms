const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  associateIrsPractitionerToCase,
} = require('./associateIrsPractitionerToCase');

const {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase.js');
const { MOCK_USERS } = require('../../../test/mockUsers');

describe('associateIrsPractitionerToCase', () => {
  let caseRecord = {
    caseCaption: 'Caption',
    caseType: CASE_TYPES_MAP.deficiency,
    contactPrimary: {
      address1: '123 Main St',
      city: 'Somewhere',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'fieri@example.com',
      name: 'Guy Fieri',
      phone: '1234567890',
      postalCode: '12345',
      state: 'CA',
    },
    docketEntries: MOCK_CASE.docketEntries,
    docketNumber: '123-19',
    filingType: 'Myself',
    partyType: PARTY_TYPES.petitioner,
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Regular',
    status: CASE_STATUS_TYPES.NEW,
    userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(caseRecord);

    applicationContext
      .getPersistenceGateway()
      .getFullCaseByDocketNumber.mockResolvedValue(caseRecord);
  });

  it('should not add mapping if already there', async () => {
    const user = {
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.irsPractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);

    await associateIrsPractitionerToCase({
      applicationContext,
      docketNumber: caseRecord.docketNumber,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      user,
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

    const user = {
      barNumber: 'BN1234',
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.irsPractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    await associateIrsPractitionerToCase({
      applicationContext,
      docketNumber: caseRecord.docketNumber,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      user,
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
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      ],
    });
  });
});
