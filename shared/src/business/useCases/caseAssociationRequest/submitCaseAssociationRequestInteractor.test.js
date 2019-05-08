const sinon = require('sinon');
const {
  submitCaseAssociationRequest,
} = require('./submitCaseAssociationRequestInteractor');

describe('submitCaseAssociationRequest', () => {
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
            role: 'seniorattorney',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          };
        },

        getPersistenceGateway: () => ({
          createMappingRecord: async () => caseRecord,
          getCaseByCaseId: async () => caseRecord,
          updateCase: async () => caseRecord,
        }),
        getUseCases: () => ({
          verifyCaseForUser: async () => caseRecord,
        }),
      };
      await submitCaseAssociationRequest({
        applicationContext,
        caseId: caseRecord.caseId,
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('should not add mapping if already there', async () => {
    let createMappingRecordSpy = sinon.spy();
    let verifyCaseForUserSpy = sinon.stub().returns(true);
    let updateCaseSpy = sinon.spy();

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
        createMappingRecord: createMappingRecordSpy,
        getCaseByCaseId: async () => caseRecord,
        updateCase: updateCaseSpy,
      }),
      getUseCases: () => ({
        verifyCaseForUser: verifyCaseForUserSpy,
      }),
    };

    await submitCaseAssociationRequest({
      applicationContext,
      caseId: caseRecord.caseId,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(createMappingRecordSpy.called).toEqual(false);
    expect(updateCaseSpy.called).toEqual(false);
  });

  it('should add mapping', async () => {
    let createMappingRecordSpy = sinon.spy();
    let verifyCaseForUserSpy = sinon.stub().returns(false);
    let updateCaseSpy = sinon.spy();

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
        createMappingRecord: createMappingRecordSpy,
        getCaseByCaseId: async () => caseRecord,
        updateCase: updateCaseSpy,
      }),
      getUseCases: () => ({
        verifyCaseForUser: verifyCaseForUserSpy,
      }),
    };

    await submitCaseAssociationRequest({
      applicationContext,
      caseId: caseRecord.caseId,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(createMappingRecordSpy.called).toEqual(true);
    expect(updateCaseSpy.called).toEqual(true);
  });
});
