const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteCaseByDocketNumber } = require('./deleteCaseByDocketNumber');

describe('deleteCaseByDocketNumber', () => {
  const caseRecords = {
    'case|101-20': [
      { pk: 'case|101-20', sk: 'case|101-20' },
      { pk: 'case|101-20', sk: 'docket-entry|1234-1451-234-1234-1234' },
    ],
    'case|102-20': [
      { pk: 'case|102-20', sk: 'case|102-20' },
      { pk: 'case|102-20', sk: 'docket-entry|1234-1451-234-1234-1234' },
      { pk: 'case|102-20', sk: 'work-item|1234-1451-234-1234-1234' }, // work-item 1
      { pk: 'case|102-20', sk: 'work-item|2234-1451-234-1234-1234' }, // work-item 2
    ],
    'case|103-20': [
      { pk: 'case|103-20', sk: 'case|103-20' },
      {
        pk: 'case|102-20',
        sk: 'case-deadline|144f89b6-850a-4fc7-b989-462d36fb62a0',
      },
    ],
  };

  const workItemRecords = {
    // work-item 1
    'work-item|1234-1451-234-1234-1234': [
      { pk: 'section|petitions', sk: 'work-item|1234-1451-234-1234-1234' },
      {
        pk: 'work-item|1234-1451-234-1234-1234',
        sk: 'work-item|1234-1451-234-1234-1234',
      },
      {
        pk: 'user|1234-1451-234-1234-1234',
        sk: 'work-item|1234-1451-234-1234-1234',
      },
    ],
    // work-item 2
    'work-item|2234-1451-234-1234-1234': [
      {
        pk: 'section-outbox|petitions',
        sk: 'work-item|2234-1451-234-1234-1234',
      },
      {
        pk: 'user-outbox|1234-1451-234-1234-1234',
        sk: 'work-item|2234-1451-234-1234-1234',
      },
    ],
  };

  beforeEach(() => {
    applicationContext
      .getDocumentClient()
      .query.mockImplementation(({ ExpressionAttributeValues }) => {
        if (
          ExpressionAttributeValues[':pk'] &&
          ExpressionAttributeValues[':pk'].includes('case|')
        ) {
          // case query
          const index = ExpressionAttributeValues[':pk'];
          return {
            promise: () => Promise.resolve({ Items: caseRecords[index] }),
          };
        } else if (
          ExpressionAttributeValues[':gsi1pk'] &&
          ExpressionAttributeValues[':gsi1pk'].includes('work-item|')
        ) {
          // work-item query
          const index = ExpressionAttributeValues[':gsi1pk'];
          return {
            promise: () => Promise.resolve({ Items: workItemRecords[index] }),
          };
        }
      });
  });

  it('attempts to delete the case', async () => {
    await deleteCaseByDocketNumber({
      applicationContext,
      docketNumber: '101-20',
    });

    expect(applicationContext.getDocumentClient().delete).toHaveBeenCalledTimes(
      caseRecords['case|101-20'].length,
    );

    expect(
      applicationContext.getDocumentClient().delete.mock.calls,
    ).toMatchObject([
      [
        {
          Key: caseRecords['case|101-20'][0],
          TableName: 'efcms-local',
        },
      ],
      [
        {
          Key: caseRecords['case|101-20'][1],
          TableName: 'efcms-local',
        },
      ],
    ]);
  });

  it('does not attempt to delete anything if case is not found', async () => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Items: [],
        }),
    });

    await deleteCaseByDocketNumber({
      applicationContext,
      docketNumber: '123-42',
    });

    expect(applicationContext.getDocumentClient().delete).toHaveBeenCalledTimes(
      0,
    );
  });

  it('fetches and deletes related workItem records', async () => {
    await deleteCaseByDocketNumber({
      applicationContext,
      docketNumber: '102-20',
    });

    const totalCalls =
      caseRecords['case|102-20'].length +
      workItemRecords['work-item|1234-1451-234-1234-1234'].length +
      workItemRecords['work-item|2234-1451-234-1234-1234'].length;

    expect(applicationContext.getDocumentClient().delete).toHaveBeenCalledTimes(
      totalCalls,
    );

    expect(
      applicationContext.getDocumentClient().delete.mock.calls,
    ).toMatchObject([
      [
        {
          Key: caseRecords['case|102-20'][0],
          TableName: 'efcms-local',
        },
      ],
      [
        {
          Key: caseRecords['case|102-20'][1],
          TableName: 'efcms-local',
        },
      ],
      [
        {
          Key: caseRecords['case|102-20'][2],
          TableName: 'efcms-local',
        },
      ],
      [
        {
          Key: caseRecords['case|102-20'][3],
          TableName: 'efcms-local',
        },
      ],
      [
        {
          Key: workItemRecords['work-item|1234-1451-234-1234-1234'][0],
          TableName: 'efcms-local',
        },
      ],
      [
        {
          Key: workItemRecords['work-item|1234-1451-234-1234-1234'][1],
          TableName: 'efcms-local',
        },
      ],
      [
        {
          Key: workItemRecords['work-item|1234-1451-234-1234-1234'][2],
          TableName: 'efcms-local',
        },
      ],
      [
        {
          Key: workItemRecords['work-item|2234-1451-234-1234-1234'][0],
          TableName: 'efcms-local',
        },
      ],
      [
        {
          Key: workItemRecords['work-item|2234-1451-234-1234-1234'][1],
          TableName: 'efcms-local',
        },
      ],
    ]);
  });

  it('fetches and deletes related case deadline records', async () => {
    await deleteCaseByDocketNumber({
      applicationContext,
      docketNumber: '103-20',
    });

    expect(applicationContext.getDocumentClient().delete).toHaveBeenCalledTimes(
      3,
    );
    expect(
      applicationContext.getDocumentClient().delete.mock.calls,
    ).toMatchObject([
      [
        {
          Key: {
            pk: 'case|103-20',
            sk: 'case|103-20',
          },
        },
      ],
      [
        {
          Key: {
            pk: 'case|103-20',
            sk: 'case-deadline|144f89b6-850a-4fc7-b989-462d36fb62a0',
          },
        },
      ],
      [
        {
          Key: {
            pk: 'case-deadline|144f89b6-850a-4fc7-b989-462d36fb62a0',
            sk: 'case-deadline|144f89b6-850a-4fc7-b989-462d36fb62a0',
          },
        },
      ],
    ]);
  });
});
