import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { processDocketEntries } from './processDocketEntries';

describe('processDocketEntries', () => {
  const mockUnsearchableDocketEntryRecord = {
    dynamodb: {
      NewImage: {
        entityName: {
          S: 'DocketEntry',
        },
        pk: {
          S: 'case|123-45',
        },
        sk: {
          S: 'docket-entry|5b928df4-2b58-463a-bfaa-eefece6af2a0',
        },
      },
    },
  };

  const mockSearchableDocketEntryRecord = {
    dynamodb: {
      NewImage: {
        documentContentsId: {
          S: 'd92a089f-085f-4888-8458-0b50771c1cc8',
        },
        entityName: {
          S: 'DocketEntry',
        },
        eventCode: {
          S: 'O',
        },
        pk: {
          S: 'case|123-45',
        },
        sk: {
          S: 'docket-entry|5b928df4-2b58-463a-bfaa-eefece6af2a0',
        },
      },
    },
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .bulkIndexRecords.mockReturnValue({ failedRecords: [] });
  });

  it('should do nothing when no docket entry records are found', async () => {
    await processDocketEntries({
      applicationContext,
      docketEntryRecords: [],
    });

    expect(
      applicationContext.getPersistenceGateway().bulkIndexRecords,
    ).not.toHaveBeenCalled();
  });

  it('should not attempt to retrieve the document contents from s3 when the docket entry is not searchable', async () => {
    await processDocketEntries({
      applicationContext,
      docketEntryRecords: [mockUnsearchableDocketEntryRecord],
    });

    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).not.toHaveBeenCalled();
  });

  it('should attempt to retrieve the document contents from s3 when the docket entry is searchable', async () => {
    const mockDocumentContents = 'you can search for this text!';
    applicationContext.getPersistenceGateway().getDocument.mockReturnValue(
      Buffer.from(
        JSON.stringify({
          documentContents: mockDocumentContents,
        }),
      ),
    );

    await processDocketEntries({
      applicationContext,
      docketEntryRecords: [mockSearchableDocketEntryRecord],
    });

    const indexedDocumentContents =
      applicationContext.getPersistenceGateway().bulkIndexRecords.mock
        .calls[0][0].records[0].dynamodb.NewImage.documentContents.S;
    expect(indexedDocumentContents).toBe(mockDocumentContents);
  });

  it('should log an error when retrieving the document contents from s3 fails', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockReturnValue(new Error());

    await processDocketEntries({
      applicationContext,
      docketEntryRecords: [mockSearchableDocketEntryRecord],
    });

    expect(applicationContext.logger.error.mock.calls[0][0]).toBe(
      `the s3 document of ${mockSearchableDocketEntryRecord.dynamodb.NewImage.documentContentsId.S} was not found in s3`,
    );
  });

  it('should construct and index the provided docket entry record', async () => {
    await processDocketEntries({
      applicationContext,
      docketEntryRecords: [mockUnsearchableDocketEntryRecord],
    });

    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().bulkIndexRecords.mock
        .calls[0][0].records,
    ).toMatchObject([
      {
        dynamodb: {
          Keys: {
            pk: {
              S: mockUnsearchableDocketEntryRecord.dynamodb.NewImage.pk.S,
            },
            sk: {
              S: mockUnsearchableDocketEntryRecord.dynamodb.NewImage.sk.S,
            },
          },
          NewImage: {
            ...mockUnsearchableDocketEntryRecord.dynamodb.NewImage,
            case_relations: {
              name: 'document',
              parent: 'case|123-45_case|123-45|mapping',
            },
          },
        },
        eventName: 'MODIFY',
      },
    ]);
  });

  it('should log an error and throw an exception when bulk index returns failed records', async () => {
    applicationContext
      .getPersistenceGateway()
      .bulkIndexRecords.mockReturnValueOnce({
        failedRecords: [{ id: 'failed record' }],
      });

    await expect(
      processDocketEntries({
        applicationContext,
        docketEntryRecords: [mockUnsearchableDocketEntryRecord],
      }),
    ).rejects.toThrow('failed to index docket entry');

    expect(applicationContext.logger.error).toHaveBeenCalled();
  });
});
