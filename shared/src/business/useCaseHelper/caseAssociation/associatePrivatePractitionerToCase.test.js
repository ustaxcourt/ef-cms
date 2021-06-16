const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  associatePrivatePractitionerToCase,
} = require('./associatePrivatePractitionerToCase');
const {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const {
  getContactPrimary,
  getContactSecondary,
} = require('../../entities/cases/Case');
const { MOCK_USERS } = require('../../../test/mockUsers');

describe('associatePrivatePractitionerToCase', () => {
  let caseRecord;

  const practitionerUser = {
    barNumber: 'BN1234',
    name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
    role: ROLES.privatePractitioner,
    userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  beforeEach(() => {
    caseRecord = {
      caseCaption: 'Case Caption',
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
          userId: '8100e22a-c7f2-4574-b4f6-eb092fca9f35',
        },
      ],
      docketNumber: '123-19',
      filingType: 'Myself',
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: [
        {
          address1: '123 Main St',
          city: 'Somewhere',
          contactId: '007d0ea1-e7ce-4f13-a6bf-3e6d9167d6fd',
          contactType: CONTACT_TYPES.primary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner@example.com',
          name: 'Test Petitioner',
          phone: '1234567',
          postalCode: '12345',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          state: 'TN',
        },
        {
          address1: '123 Main St',
          city: 'Somewhere',
          contactId: '999d0ea1-e7ce-4f13-a6bf-3e6d9167d6fd',
          contactType: CONTACT_TYPES.secondary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Test Petitioner Secondary',
          phone: '1234567',
          postalCode: '12345',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          state: 'TN',
        },
        {
          address1: '1234 Bain St',
          city: 'Somewhere',
          contactId: '111d0ea1-e7ce-4f13-a6bf-3e6d9167d6fd',
          contactType: CONTACT_TYPES.otherPetitioner,
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Test Petitioner Tertiary',
          phone: '1234567',
          postalCode: '12345',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          state: 'TN',
        },
      ],
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
      userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
    };

    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(caseRecord);
  });

  it('should not add mapping if already there', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);

    await associatePrivatePractitionerToCase({
      applicationContext,
      docketNumber: caseRecord.docketNumber,
      representing: [caseRecord.petitioners[0].contactId],
      user: practitionerUser,
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).not.toHaveBeenCalled();
  });

  it('should add mapping for a practitioner', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    await associatePrivatePractitionerToCase({
      applicationContext,
      docketNumber: caseRecord.docketNumber,
      representing: [caseRecord.petitioners[0].contactId],
      user: practitionerUser,
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalled();
  });

  it('should set petitioners to receive no service if the practitioner is representing them', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    await associatePrivatePractitionerToCase({
      applicationContext,
      docketNumber: caseRecord.docketNumber,
      representing: [
        caseRecord.petitioners[0].contactId,
        caseRecord.petitioners[1].contactId,
        caseRecord.petitioners[2].contactId,
      ],
      user: practitionerUser,
    });

    const updatedCase =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate;
    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalled();
    updatedCase.petitioners.forEach(petitioner => {
      expect(petitioner.serviceIndicator).toEqual(
        SERVICE_INDICATOR_TYPES.SI_NONE,
      );
    });
  });

  it('should only set a petitioner to receive no service if the practitioner is only representing that petitioner', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    await associatePrivatePractitionerToCase({
      applicationContext,
      docketNumber: caseRecord.docketNumber,
      representing: [caseRecord.petitioners[1].contactId],
      user: practitionerUser,
    });

    const updatedCase =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate;
    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalled();
    expect(getContactSecondary(updatedCase)).toMatchObject({
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
    });
    expect(getContactPrimary(updatedCase)).toMatchObject({
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });
  });
});
