import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { processDocketEntries } from '@web-api/business/useCases/processStreamRecords/processDocketEntries';
import { CHIEF_JUDGE, ROLES } from '@shared/business/entities/EntityConstants';

jest.mock('@web-api/persistence/postgres/docketEntries/upsertDocketEntries');

describe('processDocketEntries', () => {
  const mockDocketEntry = {
    dynamodb: {
      NewImage: {
        docketNumber: {
          S: '123-45',
        },
        entityName: {
          S: 'DocketEntry',
        },
        pk: {
          S: 'case|123-45',
        },
        sk: {
          S: 'docket-entry|297b53b0-ba5d-4f99-9ed5-f667c67bc12c',
        },
        documentType: {
          S: 'Petition',
        },
        eventCode: {
          S: 'P',
        },
        filedBy: { S: 'someone' },
        filedByRole: {
          S: ROLES.petitioner,
        },
        signedAt: {
          S: '1990-01-01T05:00:00.000Z',
        },
        signedJudgeName: { S: CHIEF_JUDGE },
        signedByUserId: { S: '997b53b0-ba5d-4f99-9ed5-f667c67bc12c' },
      },
    },
  };

  (upsertDocketEntries as jest.Mock).mockResolvedValue(undefined);

  it('should do nothing when no docket entry records are found', async () => {
    await processDocketEntries({
      docketEntryRecords: [],
    });

    expect(upsertDocketEntries).not.toHaveBeenCalled();
  });

  it('should upsert the provided docket entry record', async () => {
    await processDocketEntries({
      docketEntryRecords: [mockDocketEntry],
    });

    expect(upsertDocketEntries).toHaveBeenCalledWith([
      expect.objectContaining({ docketNumber: '123-45' }),
    ]);
  });
});
