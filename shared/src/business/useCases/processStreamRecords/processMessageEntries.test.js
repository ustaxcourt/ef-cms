const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { processMessageEntries } = require('./processMessageEntries');

describe('processMessageEntries', () => {
  const mockRepliedToMessageRecord = {
    dynamodb: {
      NewImage: {
        docketNumber: {
          S: '123-45',
        },
        entityName: {
          S: 'Message',
        },
        isRepliedTo: {
          BOOL: true,
        },
        messageId: {
          S: 'a73c3ff5-2daf-4bbd-91d1-e8e7543346e0',
        },
        pk: {
          S: 'case|123-45',
        },
        sk: {
          S: 'message|229f79aa-22d1-426e-98e2-5d9f2af472b6',
        },
      },
    },
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .bulkIndexRecords.mockReturnValue({ failedRecords: [] });
  });

  it('should do nothing when no message records are found', async () => {
    await processMessageEntries({
      applicationContext,
      messageRecords: [],
    });

    expect(
      applicationContext.getPersistenceGateway().bulkIndexRecords,
    ).not.toHaveBeenCalled();
  });

  it('should retrieve the latest message when the message has not been replied to', async () => {
    applicationContext
      .getPersistenceGateway()
      .getMessageById.mockReturnValue(mockRepliedToMessageRecord);

    await processMessageEntries({
      applicationContext,
      messageRecords: [
        {
          dynamodb: {
            NewImage: {
              ...mockRepliedToMessageRecord.dynamodb.NewImage,
              isRepliedTo: {
                BOOL: false,
              },
            },
          },
        },
      ],
    });

    expect(
      applicationContext.getPersistenceGateway().getMessageById.mock
        .calls[0][0],
    ).toMatchObject({
      docketNumber: mockRepliedToMessageRecord.dynamodb.NewImage.docketNumber.S,
      messageId: mockRepliedToMessageRecord.dynamodb.NewImage.messageId.S,
    });
  });

  it('should not retrieve the latest message when the messageNewImage.isRepliedTo is true', async () => {
    await processMessageEntries({
      applicationContext,
      messageRecords: [mockRepliedToMessageRecord],
    });

    expect(
      applicationContext.getPersistenceGateway().getMessageById,
    ).not.toHaveBeenCalled();
  });

  it('should not return any data to be indexed when the messageNewImage.isRepliedTo is false and the message from dynamo has isRepliedTo = true', async () => {
    applicationContext.getPersistenceGateway().getMessageById.mockReturnValue({
      isRepliedTo: true,
    });

    await processMessageEntries({
      applicationContext,
      messageRecords: [
        {
          dynamodb: {
            NewImage: {
              ...mockRepliedToMessageRecord.dynamodb.NewImage,
              isRepliedTo: {
                BOOL: false,
              },
            },
          },
        },
      ],
    });

    expect(
      applicationContext.getPersistenceGateway().bulkIndexRecords.mock
        .calls[0][0].records,
    ).toEqual([]);
  });

  it('should index the data returned from getMessageById instead of the NewImage if the messageNewImage.isRepliedTo is false and the message from dynamo has isRepliedTo = false', async () => {
    const mockNewestMessageInThread = {
      dynamodb: {
        NewImage: {
          ...mockRepliedToMessageRecord.dynamodb.NewImage,
          isRepliedTo: {
            BOOL: false,
          },
          text: {
            S: 'newest message!',
          },
        },
      },
    };
    applicationContext
      .getPersistenceGateway()
      .getMessageById.mockReturnValue(mockNewestMessageInThread);

    await processMessageEntries({
      applicationContext,
      messageRecords: [
        {
          dynamodb: {
            NewImage: {
              ...mockRepliedToMessageRecord.dynamodb.NewImage,
              isRepliedTo: {
                BOOL: false,
              },
            },
          },
        },
      ],
    });

    const indexedMessageText =
      applicationContext.getPersistenceGateway().bulkIndexRecords.mock
        .calls[0][0].records[0].dynamodb.NewImage.dynamodb.M.NewImage.M.text.M.S
        .S;
    expect(indexedMessageText).toBe(
      mockNewestMessageInThread.dynamodb.NewImage.text.S,
    );
  });

  it('should index the provided message record', async () => {
    await processMessageEntries({
      applicationContext,
      messageRecords: [mockRepliedToMessageRecord],
    });

    expect(
      applicationContext.getPersistenceGateway().bulkIndexRecords.mock
        .calls[0][0].records,
    ).toEqual([mockRepliedToMessageRecord]);
  });

  it('should log an error and throw an exception when bulk index returns failed records', async () => {
    applicationContext
      .getPersistenceGateway()
      .bulkIndexRecords.mockReturnValueOnce({
        failedRecords: [{ id: 'failed record' }],
      });

    await expect(
      processMessageEntries({
        applicationContext,
        messageRecords: [mockRepliedToMessageRecord],
      }),
    ).rejects.toThrow('failed to index message records');

    expect(applicationContext.logger.error).toHaveBeenCalled();
  });
});
