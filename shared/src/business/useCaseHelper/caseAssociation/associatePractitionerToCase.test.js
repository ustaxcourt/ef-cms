const {
  associatePractitionerToCase,
} = require('./associatePractitionerToCase');
const {
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/cases/CaseConstants');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { User } = require('../../entities/User');

describe('associatePractitionerToCase', () => {
  let applicationContext;

  let caseRecord;
  const associateUserWithCaseSpy = jest.fn();
  const updateCaseSpy = jest.fn();
  let verifyCaseForUserSpy;

  const practitionerUser = {
    name: 'Olivia Jade',
    role: User.ROLES.practitioner,
    userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    caseRecord = {
      caseCaption: 'Case Caption',
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      caseType: 'Deficiency',
      contactPrimary: {
        address1: '123 Main St',
        city: 'Somewhere',
        countryType: 'domestic',
        email: 'petitioner@example.com',
        name: 'Test Petitioner',
        phone: '1234567',
        postalCode: '12345',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        state: 'TN',
      },
      contactSecondary: {
        address1: '123 Main St',
        city: 'Somewhere',
        countryType: 'domestic',
        name: 'Test Petitioner Secondary',
        phone: '1234567',
        postalCode: '12345',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        state: 'TN',
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
          processingStatus: 'pending',
          userId: 'petitioner',
        },
      ],
      filingType: 'Myself',
      partyType: 'Petitioner & spouse',
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
    };

    applicationContext = {
      getCurrentUser: () => MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
      getPersistenceGateway: () => ({
        associateUserWithCase: associateUserWithCaseSpy,
        getCaseByCaseId: async () => caseRecord,
        updateCase: updateCaseSpy,
        verifyCaseForUser: verifyCaseForUserSpy,
      }),
    };
  });

  it('should not add mapping if already there', async () => {
    verifyCaseForUserSpy = jest.fn().mockReturnValue(true);

    await associatePractitionerToCase({
      applicationContext,
      caseId: caseRecord.caseId,
      representingPrimary: true,
      representingSecondary: false,
      user: practitionerUser,
    });

    expect(associateUserWithCaseSpy).not.toBeCalled();
    expect(updateCaseSpy).not.toBeCalled();
  });

  it('should add mapping for a practitioner', async () => {
    verifyCaseForUserSpy = jest.fn().mockReturnValue(false);

    await associatePractitionerToCase({
      applicationContext,
      caseId: caseRecord.caseId,
      representingPrimary: true,
      representingSecondary: false,
      user: practitionerUser,
    });

    expect(associateUserWithCaseSpy).toBeCalled();
    expect(updateCaseSpy).toBeCalled();
  });

  it('should set contactPrimary and contactSecondary to receive no service if the practitioner is representing both parties', async () => {
    verifyCaseForUserSpy = jest.fn().mockReturnValue(false);

    await associatePractitionerToCase({
      applicationContext,
      caseId: caseRecord.caseId,
      representingPrimary: true,
      representingSecondary: true,
      user: practitionerUser,
    });

    expect(associateUserWithCaseSpy).toBeCalled();
    expect(updateCaseSpy).toBeCalled();
    expect(updateCaseSpy.mock.calls[0][0].caseToUpdate).toMatchObject({
      contactPrimary: { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE },
      contactSecondary: { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE },
    });
  });

  it('should only set contactSecondary to receive no service if the practitioner is only representing contactSecondary', async () => {
    verifyCaseForUserSpy = jest.fn().mockReturnValue(false);

    await associatePractitionerToCase({
      applicationContext,
      caseId: caseRecord.caseId,
      representingPrimary: false,
      representingSecondary: true,
      user: practitionerUser,
    });

    expect(associateUserWithCaseSpy).toBeCalled();
    expect(updateCaseSpy).toBeCalled();
    expect(updateCaseSpy.mock.calls[0][0].caseToUpdate).toMatchObject({
      contactPrimary: {
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
      contactSecondary: { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE },
    });
  });
});
