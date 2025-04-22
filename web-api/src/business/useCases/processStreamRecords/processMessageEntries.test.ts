import '@web-api/persistence/postgres/messages/mocks.jest';
import { processMessageEntries } from './processMessageEntries';
import { upsertMessages } from '@web-api/persistence/postgres/messages/upsertMessages';

describe('processMessageEntries', () => {
  beforeEach(() => {
    (upsertMessages as jest.Mock).mockResolvedValue(undefined);
  });

  it('should attempt to store the messages using the upsert method', async () => {
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
        },
      },
    };

    await processMessageEntries({
      messageRecords: [mockRepliedToMessageRecord],
    });

    expect(upsertMessages).toHaveBeenCalled();
  });
});
