const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  associatePrivatePractitionerWithCaseInteractor,
} = require('./associatePrivatePractitionerWithCaseInteractor');
const {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');

describe('associatePrivatePractitionerWithCaseInteractor', () => {
  let caseRecord = {
    caseCaption: 'Caption',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    documents: [
      {
        createdAt: '2018-11-21T20:49:28.192Z',
        documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentTitle: 'Petition',
        documentType: 'Petition',
        eventCode: 'P',
        filedBy: 'Test Petitioner',
        processingStatus: 'pending',
        userId: 'd13d017b-28d1-45b6-aa7d-f54865b0121b',
      },
    ],
    filingType: 'Myself',
    partyType: PARTY_TYPES.petitioner,
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Regular',
  };

  it('should throw an error when not authorized', async () => {
    await expect(
      associatePrivatePractitionerWithCaseInteractor({
        applicationContext,
        docketNumber: caseRecord.docketNumber,
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should add mapping for a practitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.adc,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => {
        return {
          name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
          role: ROLES.privatePractitioner,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        };
      });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseRecord);
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    await associatePrivatePractitionerWithCaseInteractor({
      applicationContext,
      docketNumber: caseRecord.docketNumber,
      representingPrimary: true,
      representingSecondary: false,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });
});
