const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const { getCaseByDocketNumber } = require('./getCaseByDocketNumber');

const applicationContext = {
  environment: {
    stage: 'local',
  },
  filterCaseMetadata: ({ cases }) => cases,
  isAuthorizedForWorkItems: () => true,
};

describe('getCaseByDocketNumber', () => {
  beforeEach(() => {
    sinon.stub(client, 'get').resolves({
      caseId: '123',
      pk: 'case|123',
      sk: 'case|123',
      status: 'New',
    });
    sinon.stub(client, 'put').resolves({
      caseId: '123',
      pk: 'case|123',
      sk: 'case|123',
      status: 'New',
    });
    sinon.stub(client, 'delete').resolves({
      caseId: '123',
      pk: 'case|123',
      sk: 'case|123',
      status: 'New',
    });
    sinon.stub(client, 'batchGet').resolves([
      {
        caseId: '123',
        pk: 'case|123',
        sk: 'case|123',
        status: 'New',
      },
    ]);
    sinon.stub(client, 'query').resolves([
      {
        caseId: '123',
        pk: 'case|123',
        sk: 'case|123',
        status: 'New',
      },
    ]);
    sinon.stub(client, 'batchWrite').resolves(null);
    sinon.stub(client, 'updateConsistent').resolves(null);
  });

  afterEach(() => {
    client.get.restore();
    client.delete.restore();
    client.put.restore();
    client.query.restore();
    client.batchGet.restore();
    client.batchWrite.restore();
    client.updateConsistent.restore();
  });

  it('should return data as received from persistence', async () => {
    const result = await getCaseByDocketNumber({
      applicationContext,
      docketNumber: '101-18',
    });
    expect(result).toEqual({
      caseId: '123',
      docketRecord: [],
      documents: [],
      pk: 'case|123',
      practitioners: [],
      respondents: [],
      sk: 'case|123',
      status: 'New',
    });
  });

  it('should return the case and its associated data', async () => {
    client.query.resolves([
      {
        caseId: '123',
        pk: 'case|123',
        sk: 'case|123',
        status: 'New',
      },
      {
        pk: 'case|123',
        sk: 'respondent|123',
        userId: 'abc-123',
      },
      {
        pk: 'case|123',
        sk: 'practitioner|123',
        userId: 'abc-123',
      },
      {
        docketRecordId: 'abc-123',
        pk: 'case|123',
        sk: 'docket-record|123',
      },
      {
        documentId: 'abc-123',
        pk: 'case|123',
        sk: 'document|123',
      },
    ]);
    const result = await getCaseByDocketNumber({
      applicationContext,
      docketNumber: '101-18',
    });
    expect(result).toEqual({
      caseId: '123',
      docketRecord: [
        {
          docketRecordId: 'abc-123',
          pk: 'case|123',
          sk: 'docket-record|123',
        },
      ],
      documents: [
        {
          documentId: 'abc-123',
          pk: 'case|123',
          sk: 'document|123',
        },
      ],
      pk: 'case|123',
      practitioners: [
        {
          pk: 'case|123',
          sk: 'practitioner|123',
          userId: 'abc-123',
        },
      ],
      respondents: [
        { pk: 'case|123', sk: 'respondent|123', userId: 'abc-123' },
      ],
      sk: 'case|123',
      status: 'New',
    });
  });

  it('should return null if no mapping records are returned from the query', async () => {
    client.query.resolves([]);
    const result = await getCaseByDocketNumber({
      applicationContext,
      docketNumber: '101-18',
    });
    expect(result).toBeNull();
  });
});
