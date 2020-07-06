const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  associateIrsPractitionerWithCaseInteractor,
} = require('./associateIrsPractitionerWithCaseInteractor');
const {
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase.js');

describe('associateIrsPractitionerWithCaseInteractor', () => {
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
    docketRecord: MOCK_CASE.docketRecord,
    documents: MOCK_CASE.documents,
    filingType: 'Myself',
    partyType: PARTY_TYPES.petitioner,
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Regular',
  };

  let mockCurrentUser;
  let mockUserById;

  beforeAll(() => {
    applicationContext.getCurrentUser.mockImplementation(() => mockCurrentUser);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => mockUserById);

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockImplementation(() => caseRecord);
  });

  it('should throw an error when not authorized', async () => {
    mockCurrentUser = {};

    await expect(
      associateIrsPractitionerWithCaseInteractor({
        applicationContext,
        caseId: caseRecord.caseId,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should add mapping for an irsPractitioner', async () => {
    mockCurrentUser = {
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.adc,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
    mockUserById = {
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.irsPractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    await associateIrsPractitionerWithCaseInteractor({
      applicationContext,
      caseId: caseRecord.caseId,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });
});
