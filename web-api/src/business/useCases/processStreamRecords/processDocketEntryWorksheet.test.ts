jest.mock(
  '@web-api/persistence/postgres/docketEntryWorksheets/upsertDocketEntryWorksheets',
);
import { processDocketEntryWorksheetEntries } from '@web-api/business/useCases/processStreamRecords/processDocketEntryWorksheetEntries';
import { DynamoDBRecord } from 'aws-lambda';
import { upsertDocketEntryWorksheets as upsertDocketEntryWorksheetsMock } from '@web-api/persistence/postgres/docketEntryWorksheets/upsertDocketEntryWorksheets';

describe('processDocketEntryWorksheetEntries', () => {
  const upsertDocketEntryWorksheets = jest.mocked(
    upsertDocketEntryWorksheetsMock,
  );

  it('should processDocketEntryWorksheetEntries', async () => {
    const docketEntryId = '7814b51f-c5df-4975-97f6-a35fb78f314e';
    const mockDocketEntryWorksheetRecord: DynamoDBRecord = {
      dynamodb: {
        NewImage: {
          pk: {
            S: `docket-entry|${docketEntryId}`,
          },
          sk: {
            S: `docket-entry-worksheet|${docketEntryId}`,
          },
          docketEntryId: {
            S: `${docketEntryId}`,
          },
        },
      },
    };
    const records = [mockDocketEntryWorksheetRecord];

    await processDocketEntryWorksheetEntries({
      docketEntryWorksheetRecords: records,
    });

    expect(
      upsertDocketEntryWorksheets.mock.calls[0][0].docketEntryWorksheets[0]
        .docketEntryId,
    ).toEqual(docketEntryId);
  });
});
