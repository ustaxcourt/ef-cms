import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { deleteWorkItem } from './deleteWorkItem';

const mockWorkItemId = '437da979-89f3-49fc-bf3e-7b09d9691410';
const mockDocketNumber = '101-21';
const mockTimestamp = '2021-03-16T17:15:25.685Z';

describe('deleteWorkItem', () => {
  beforeAll(() => {
    applicationContext.getDocumentClient().batchWrite.mockReturnValue({
      promise: () => Promise.resolve(true),
    });
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Items: [
            {
              docketNumber: mockDocketNumber,
              pk: `case|${mockDocketNumber}`,
              sk: `work-item|${mockWorkItemId}`,
            },
            {
              docketNumber: mockDocketNumber,
              pk: 'section-outbox|docket|2021-03',
              sk: mockTimestamp,
            },
            {
              docketNumber: mockDocketNumber,
              pk: 'section-outbox|docket',
              sk: mockTimestamp,
            },
          ],
        }),
    });
  });

  it('invokes the persistence layer with pk of case|{docketNumber} and sk of work-item|{workItemId}', async () => {
    await deleteWorkItem({
      applicationContext,
      workItem: {
        docketNumber: mockDocketNumber,
        gsi1pk: `work-item|${mockWorkItemId}`,
        workItemId: mockWorkItemId,
      } as any,
    });

    expect(
      applicationContext.getDocumentClient().batchWrite.mock.calls[0][0],
    ).toEqual({
      RequestItems: {
        'efcms-local': expect.arrayContaining([
          expect.objectContaining({
            DeleteRequest: {
              Key: {
                pk: `case|${mockDocketNumber}`,
                sk: `work-item|${mockWorkItemId}`,
              },
            },
          }),
          expect.objectContaining({
            DeleteRequest: {
              Key: {
                pk: 'section-outbox|docket|2021-03',
                sk: mockTimestamp,
              },
            },
          }),
          expect.objectContaining({
            DeleteRequest: {
              Key: {
                pk: 'section-outbox|docket',
                sk: mockTimestamp,
              },
            },
          }),
        ]),
      },
    });
  });
});
