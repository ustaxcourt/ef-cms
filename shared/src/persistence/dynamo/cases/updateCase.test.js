jest.mock('../../dynamodbClientService');
const client = require('../../dynamodbClientService');
const { Case } = require('../../../business/entities/cases/Case');
const { updateCase } = require('./updateCase');

describe('updateCase', () => {
  let applicationContext;

  const putStub = jest.fn().mockReturnValue({
    promise: async () => null,
  });

  const getStub = jest.fn().mockReturnValue({
    docketNumberSuffix: null,
    inProgress: false,
    status: Case.STATUS_TYPES.generalDocket,
  });

  const queryStub = jest.fn().mockReturnValue([
    {
      sk: '123',
    },
  ]);

  const updateStub = jest.fn();

  client.get = getStub;
  client.put = putStub;
  client.query = queryStub;
  client.update = updateStub;

  beforeEach(() => {
    jest.clearAllMocks();

    applicationContext = {
      environment: {
        stage: 'local',
      },
      getUniqueId: () => 'unique-id-1',
    };
  });

  it('updates case', async () => {
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
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      pk: '123',
      sk: '123',
    });
  });

  it('updates fields on work items', async () => {
    await updateCase({
      applicationContext,
      caseToUpdate: {
        associatedJudge: 'Judge Buch',
        caseCaption: 'New caption',
        caseId: '123',
        docketNumber: '101-18',
        docketNumberSuffix: 'W',
        inProgress: true,
        status: Case.STATUS_TYPES.calendared,
        trialDate: '2019-03-01T21:40:46.415Z',
        userId: 'petitioner',
      },
    });
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      pk: '123',
      sk: '123',
    });
    expect(updateStub.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':caseStatus': Case.STATUS_TYPES.calendared,
      },
    });
    expect(updateStub.mock.calls[1][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':caseTitle': 'New caption',
      },
    });
    expect(updateStub.mock.calls[2][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':docketNumberSuffix': 'W',
      },
    });
    expect(updateStub.mock.calls[3][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':trialDate': '2019-03-01T21:40:46.415Z',
      },
    });
    expect(updateStub.mock.calls[4][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':associatedJudge': 'Judge Buch',
      },
    });
    expect(updateStub.mock.calls[5][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':caseIsInProgress': true,
      },
    });
  });

  it('updates associated judge on work items', async () => {
    await updateCase({
      applicationContext,
      caseToUpdate: {
        associatedJudge: 'Judge Buch',
        caseId: '123',
        docketNumberSuffix: null,
        status: Case.STATUS_TYPES.generalDocket,
      },
    });
    expect(updateStub.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':associatedJudge': 'Judge Buch',
      },
    });
  });

  it('does not update work items if work item fields are unchanged', async () => {
    await updateCase({
      applicationContext,
      caseToUpdate: {
        caseId: '123',
        docketNumberSuffix: null,
        status: Case.STATUS_TYPES.generalDocket,
      },
    });
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      pk: '123',
      sk: '123',
    });
    expect(updateStub).not.toBeCalled();
  });
});
