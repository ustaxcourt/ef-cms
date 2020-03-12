const {
  associateIrsPractitionerWithCaseInteractor,
} = require('./associateIrsPractitionerWithCaseInteractor');
const {
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/cases/CaseConstants');
const { MOCK_CASE } = require('../../../test/mockCase.js');
const { User } = require('../../entities/User');

describe('associateIrsPractitionerWithCaseInteractor', () => {
  let applicationContext;

  let caseRecord = {
    caseCaption: 'Caption',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    caseType: 'Deficiency',
    docketNumber: '123-19',
    docketRecord: MOCK_CASE.docketRecord,
    documents: MOCK_CASE.documents,
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
        getUniqueId: () => 'unique-id-1',
      };
      await associateIrsPractitionerWithCaseInteractor({
        applicationContext,
        caseId: caseRecord.caseId,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('should add mapping for an irsPractitioner', async () => {
    let updateCaseSpy = jest.fn();

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
          role: User.ROLES.irsPractitioner,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
        updateCase: updateCaseSpy,
        verifyCaseForUser: async () => false,
      }),
      getUniqueId: () => 'unique-id-1',
    };

    await associateIrsPractitionerWithCaseInteractor({
      applicationContext,
      caseId: caseRecord.caseId,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(updateCaseSpy).toBeCalled();
  });
});
