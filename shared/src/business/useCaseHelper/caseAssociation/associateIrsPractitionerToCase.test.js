const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  associateIrsPractitionerToCase,
} = require('./associateIrsPractitionerToCase');
const {
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase.js');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { ROLES } = require('../../entities/EntityConstants');

describe('associateIrsPractitionerToCase', () => {
  let caseRecord = {
    caseCaption: 'Caption',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    caseType: 'Deficiency',
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
    docketNumber: '123-19',
    docketRecord: [
      {
        description: 'first record',
        documentId: '8675309b-18d0-43ec-bafb-654e83405411',
        eventCode: 'P',
        filingDate: '2018-03-01T00:01:00.000Z',
        index: 1,
      },
    ],
    documents: MOCK_CASE.documents,
    filingType: 'Myself',
    partyType: 'Petitioner',
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Regular',
    status: 'New',
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockResolvedValue(caseRecord);
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
      caseId: caseRecord.caseId,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      user,
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toHaveBeenCalled();
  });

  it('should add mapping for an irsPractitioner', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    const user = {
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.irsPractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    await associateIrsPractitionerToCase({
      applicationContext,
      caseId: caseRecord.caseId,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      user,
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
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
