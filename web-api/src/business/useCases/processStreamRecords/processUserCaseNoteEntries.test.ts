import '@web-api/persistence/postgres/messages/mocks.jest';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { processMessageEntries } from './processMessageEntries';
import { upsertUserCaseNotes } from '@web-api/persistence/postgres/userCaseNotes/upsertUserCaseNotes';

jest.mock('@web-api/persistence/postgres/messages/upsertMessages');

describe('processUserCaseNoteEntries', () => {
  beforeEach(() => {
    (upsertUserCaseNotes as jest.Mock).mockResolvedValue(undefined);
  });

  it('should attempt to store the user case notes using the upsert method', async () => {
    const mockUserCaseNoteRecord = {
      dynamodb: {
        NewImage: {
          docketNumber: {
            S: '104-20',
          },
          entityName: {
            S: 'UserCaseNote',
          },
          notes: {
            S: 'Test',
          },
          pk: {
            S: 'user-case-note|104-20',
          },
          sk: {
            S: 'user|c4a1a9da-ac90-40f1-8d4d-d494c219cbbe',
          },
          userId: {
            S: 'c4a1a9da-ac90-40f1-8d4d-d494c219cbbe',
          },
        },
      },
    };

    await processMessageEntries({
      applicationContext,
      messageRecords: [mockUserCaseNoteRecord],
    });

    expect(upsertUserCaseNotes).toHaveBeenCalled();
  });
});
