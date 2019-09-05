const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
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
      status: 'General Docket - Not at Issue',
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
        currentVersion: '10',
        docketNumber: '101-18',
        docketNumberSuffix: null,
        status: 'General Docket - Not at Issue',
        userId: 'taxpayer',
      },
    });
    expect(putStub.getCall(0).args[0].Item).toMatchObject({
      pk: 'catalog',
      sk: 'case-123',
    });
    expect(putStub.getCall(1).args[0].Item).toMatchObject({
      pk: '123',
      sk: '0',
    });
    expect(putStub.getCall(2).args[0].Item).toMatchObject({
      pk: '123',
      sk: '11',
    });
  });
});
