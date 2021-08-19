const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  associatePrivatePractitionerWithCaseInteractor,
} = require('./associatePrivatePractitionerWithCaseInteractor');
const {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');

describe('associatePrivatePractitionerWithCaseInteractor', () => {
  const caseRecord = {
    caseCaption: 'Caption',
    caseType: CASE_TYPES_MAP.deficiency,
    docketEntries: [
      {
        createdAt: '2018-11-21T20:49:28.192Z',
        docketEntryId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        docketNumber: '123-19',
        documentTitle: 'Petition',
        documentType: 'Petition',
        eventCode: 'P',
        filedBy: 'Test Petitioner',
        processingStatus: 'pending',
        userId: 'd13d017b-28d1-45b6-aa7d-f54865b0121b',
      },
    ],
    docketNumber: '123-19',
    filingType: 'Myself',
    partyType: PARTY_TYPES.petitioner,
    petitioners: [
      {
        address1: '123 Main St',
        city: 'Somewhere',
        contactId: 'f354ab90-5fb1-4012-8714-6636c0939945',
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
    userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
  };

  it('should throw an error when not authorized', async () => {
    await expect(
      associatePrivatePractitionerWithCaseInteractor(applicationContext, {
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
          barNumber: 'BN1234',
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

    await associatePrivatePractitionerWithCaseInteractor(applicationContext, {
      docketNumber: caseRecord.docketNumber,
      representing: [caseRecord.petitioners[0].contactId],
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toBeCalled();
  });
});
