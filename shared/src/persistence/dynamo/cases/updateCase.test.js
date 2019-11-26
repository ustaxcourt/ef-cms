const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const { Case } = require('../../../business/entities/cases/Case');
const { updateCase } = require('./updateCase');

describe('updateCase', () => {
  let applicationContext;
  let putStub, getStub;

  beforeEach(() => {
    putStub = sinon.stub().returns({
      promise: async () => null,
    });
    getStub = sinon.stub(client, 'get').resolves({
      docketNumberSuffix: null,
      status: Case.STATUS_TYPES.generalDocket,
    });

    applicationContext = {
      environment: {
        stage: 'local',
      },
      getDocumentClient: () => ({
        get: getStub,
        put: putStub,
      }),
    };
  });

  it('updates case with new version number', async () => {
    await updateCase({
      applicationContext,
      caseToUpdate: {
        caseId: '123',
        docketNumber: '101-18',
        docketNumberSuffix: null,
        status: Case.STATUS_TYPES.generalDocket,
        userId: 'petitioner',
      },
    });
    expect(putStub.getCall(0).args[0].Item).toMatchObject({
      pk: '123',
      sk: '123',
    });
  });
});
