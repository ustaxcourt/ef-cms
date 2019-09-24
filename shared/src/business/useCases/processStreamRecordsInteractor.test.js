const {
  processStreamRecordsInteractor,
} = require('./processStreamRecordsInteractor');

describe('processStreamRecordsInteractor', () => {
  const indexSpy = jest.fn();

  const applicationContext = {
    environment: { stage: 'local' },
    getSearchClient: () => ({
      index: indexSpy,
    }),
    logger: {
      info: () => {},
    },
  };

  it('does not call index function if recordsToProcess is an empty array', async () => {
    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [],
    });

    expect(indexSpy).not.toHaveBeenCalled();
  });

  it('calls index function with correct params only for records with eventName "INSERT"', async () => {
    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: '1' } },
            NewImage: { caseId: { S: '1' } },
          },
          eventName: 'INSERT',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '2' } },
            NewImage: { caseId: { S: '2' } },
          },
          eventName: 'NOTINSERT',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '3' } },
            NewImage: { caseId: { S: '3' } },
          },
          eventName: 'INSERT',
        },
      ],
    });

    expect(indexSpy).toHaveBeenCalled();
    expect(indexSpy.mock.calls.length).toEqual(2);
    expect(indexSpy.mock.calls[0][0]).toEqual({
      body: {
        caseId: '1',
      },
      id: '1',
      index: 'efcms',
    });
    expect(indexSpy.mock.calls[1][0]).toEqual({
      body: {
        caseId: '3',
      },
      id: '3',
      index: 'efcms',
    });
  });
});
