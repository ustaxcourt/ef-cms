const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  submitCaseAssociationRequestInteractor,
} = require('./submitCaseAssociationRequestInteractor');
const { MOCK_CASE } = require('../../../test/mockCase.js');
const { User } = require('../../entities/User');

describe('submitCaseAssociationRequest', () => {
  let caseRecord = {
    caseCaption: 'Caption',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    caseType: 'Deficiency',
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
  };

  it('should throw an error when not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Olivia Jade',
      role: User.ROLES.adc,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await expect(
      submitCaseAssociationRequestInteractor({
        applicationContext,
        caseId: caseRecord.caseId,
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should not add mapping if already there', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Olivia Jade',
      role: User.ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        countryType: 'domestic',
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      name: 'Olivia Jade',
      role: User.ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(caseRecord);
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);

    await submitCaseAssociationRequestInteractor({
      applicationContext,
      caseId: caseRecord.caseId,
      representingPrimary: true,
      representingSecondary: false,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toBeCalled();
  });

  it('should add mapping for a practitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        countryType: 'domestic',
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      name: 'Olivia Jade',
      role: User.ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    await submitCaseAssociationRequestInteractor({
      applicationContext,
      caseId: caseRecord.caseId,
      representingPrimary: true,
      representingSecondary: false,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });

  it('should add mapping for an irsPractitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Olivia Jade',
      role: User.ROLES.irsPractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    await submitCaseAssociationRequestInteractor({
      applicationContext,
      caseId: caseRecord.caseId,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });
});
