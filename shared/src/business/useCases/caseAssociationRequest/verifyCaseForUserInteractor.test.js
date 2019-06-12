const sinon = require('sinon');
const { verifyCaseForUser } = require('./verifyCaseForUserInteractor');

describe('verifyCaseForUser', () => {
  let applicationContext;

  let caseRecord = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    docketNumber: '123-19',
  };

  it('should return results retrieved from persistence', async () => {
    let verifyCaseForUserSpy = sinon.stub().returns(true);

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          name: 'Olivia Jade',
          role: 'practitioner',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        };
      },
      getPersistenceGateway: () => ({
        verifyCaseForUser: verifyCaseForUserSpy,
      }),
    };

    await verifyCaseForUser({
      applicationContext,
      caseId: caseRecord.caseId,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(verifyCaseForUserSpy.called).toEqual(true);
  });
});
