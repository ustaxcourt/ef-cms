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
  let caseRecord1;
  let caseRecord2;

  const practitionerUser = {
    barNumber: 'BN1234',
    name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
    role: ROLES.privatePractitioner,
    userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  beforeEach(() => {
    caseRecord1 = {
      caseCaption: 'Case Caption',
      caseType: CASE_TYPES_MAP.deficiency,
      docketEntries: [
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketEntryId: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
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
      leadDocketNumber: '123-19',
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

    caseRecord2 = {
      caseCaption: 'Caption',
      caseType: CASE_TYPES_MAP.deficiency,
      docketEntries: [
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketEntryId: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
          docketNumber: '123-19',
          documentTitle: 'Petition',
          documentType: 'Petition',
          eventCode: 'P',
          filedBy: 'Test Petitioner',
          processingStatus: 'pending',
          userId: '8100e22a-c7f2-4574-b4f6-eb092fca9f35',
        },
      ],
      docketNumber: '124-19',
      filingType: 'Myself',
      leadDocketNumber: '123-19',
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
      userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
    };

    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(caseRecord1);
  });

  it('should not add mapping if already there', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);

    await associatePrivatePractitionerToCase({
      applicationContext,
      docketNumber: caseRecord1.docketNumber,
      representing: [caseRecord1.petitioners[0].contactId],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
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
      docketNumber: caseRecord1.docketNumber,
      representing: [caseRecord1.petitioners[0].contactId],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      user: practitionerUser,
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalled();
  });

  it('should add mapping to all cases in a consolidated group for a privatePractitioner', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce(caseRecord1)
      .mockResolvedValueOnce(caseRecord2);

    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    const user = {
      barNumber: 'RT9834',
      name: 'Nick "Goose" Bradshaw',
      role: ROLES.privatePractitioner,
      userId: '330d4b65-620a-489d-8414-6623653ebc4f',
    };

    await associatePrivatePractitionerToCase({
      applicationContext,
      consolidatedCasesDocketNumbers: [
        caseRecord1.docketNumber,
        caseRecord2.docketNumber,
      ],
      docketNumber: caseRecord1.docketNumber,
      representing: [caseRecord1.petitioners[0].contactId],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      user,
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate,
    ).toMatchObject({
      privatePractitioners: [
        {
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          userId: '330d4b65-620a-489d-8414-6623653ebc4f',
        },
      ],
    });
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[1][0].caseToUpdate,
    ).toMatchObject({
      privatePractitioners: [
        {
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          userId: '330d4b65-620a-489d-8414-6623653ebc4f',
        },
      ],
    });
  });

  it('should set petitioners to receive no service if the practitioner is representing them', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    await associatePrivatePractitionerToCase({
      applicationContext,
      docketNumber: caseRecord1.docketNumber,
      representing: [
        caseRecord1.petitioners[0].contactId,
        caseRecord1.petitioners[1].contactId,
        caseRecord1.petitioners[2].contactId,
      ],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
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
      docketNumber: caseRecord1.docketNumber,
      representing: [caseRecord1.petitioners[1].contactId],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
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

  it('BUG 9323: should create log if practitioner is already associated with case but does not appear in the privatePractitioners array', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockResolvedValueOnce(true);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce({
        ...caseRecord1,
        privatePractitioners: [],
      });

    await associatePrivatePractitionerToCase({
      applicationContext,
      docketNumber: caseRecord1.docketNumber,
      representing: [],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      user: practitionerUser,
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).not.toHaveBeenCalled();

    expect(applicationContext.logger.error).toHaveBeenCalled();
    expect(applicationContext.logger.error.mock.calls[0][0]).toEqual(
      `BUG 9323: Private Practitioner with userId: ${practitionerUser.userId} was already associated with case ${caseRecord1.docketNumber} but did not appear in the privatePractitioners array.`,
    );
  });

  it('BUG 9323: should create NO log if practitioner is already associated with case and DOES appear in the privatePractitioners array', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockResolvedValueOnce(true);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce({
        ...caseRecord1,
        privatePractitioners: [{ userId: practitionerUser.userId }],
      });

    await associatePrivatePractitionerToCase({
      applicationContext,
      docketNumber: caseRecord1.docketNumber,
      representing: [caseRecord1.petitioners[0].contactId],
      user: practitionerUser,
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).not.toHaveBeenCalled();

    expect(applicationContext.logger.error).not.toHaveBeenCalled();
  });
});
