const sinon = require('sinon');
const {
  associatePractitionerWithCaseInteractor,
} = require('./associatePractitionerWithCaseInteractor');
const { User } = require('../../entities/User');

describe('associateRespondentWithCaseInteractor', () => {
  let applicationContext;

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
    partyType: 'Petitioner',
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Regular',
  };

  it('should throw an error when not authorized', async () => {
    let error;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            name: 'Olivia Jade',
            role: User.ROLES.petitioner,
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          };
        },
        getPersistenceGateway: () => ({
          getCaseByCaseId: async () => caseRecord,
          getUserById: async () => ({
            name: 'Olivia Jade',
            role: User.ROLES.adc,
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          }),
          updateCase: async () => caseRecord,
          verifyCaseForUser: async () => true,
        }),
      };
      await associatePractitionerWithCaseInteractor({
        applicationContext,
        caseId: caseRecord.caseId,
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('should add mapping for a practitioner', async () => {
    let updateCaseSpy = sinon.spy();

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          name: 'Olivia Jade',
          role: User.ROLES.adc,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        };
      },
      getPersistenceGateway: () => ({
        associateUserWithCase: () => {},
        getCaseByCaseId: async () => caseRecord,
        getUserById: async () => ({
          name: 'Olivia Jade',
          role: User.ROLES.practitioner,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
        updateCase: updateCaseSpy,
        verifyCaseForUser: async () => false,
      }),
    };

    await associatePractitionerWithCaseInteractor({
      applicationContext,
      caseId: caseRecord.caseId,
      representingPrimary: true,
      representingSecondary: false,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(updateCaseSpy.called).toEqual(true);
  });
});
