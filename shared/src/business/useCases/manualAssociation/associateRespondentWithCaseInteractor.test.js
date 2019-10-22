const sinon = require('sinon');
const {
  associateRespondentWithCaseInteractor,
} = require('./associateRespondentWithCaseInteractor');
const { User } = require('../../entities/User');

describe('associateRespondentWithCaseInteractor', () => {
  let applicationContext;

  let caseRecord = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    docketNumber: '123-19',
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
            role: User.ROLES.seniorAttorney,
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          }),
          updateCase: async () => caseRecord,
          verifyCaseForUser: async () => true,
        }),
      };
      await associateRespondentWithCaseInteractor({
        applicationContext,
        caseId: caseRecord.caseId,
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('should add mapping for a respondent', async () => {
    let updateCaseSpy = sinon.spy();

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          name: 'Olivia Jade',
          role: User.ROLES.seniorAttorney,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        };
      },
      getPersistenceGateway: () => ({
        associateUserWithCase: () => {},
        getCaseByCaseId: async () => caseRecord,
        getUserById: async () => ({
          name: 'Olivia Jade',
          role: User.ROLES.respondent,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
        updateCase: updateCaseSpy,
        verifyCaseForUser: async () => false,
      }),
    };

    await associateRespondentWithCaseInteractor({
      applicationContext,
      caseId: caseRecord.caseId,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(updateCaseSpy.called).toEqual(true);
  });
});
