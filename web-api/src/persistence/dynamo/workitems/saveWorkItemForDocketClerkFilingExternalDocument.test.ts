import { DOCKET_SECTION } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createISODateString } from '../../../../../shared/src/business/utilities/DateHandler';
import { saveWorkItemForDocketClerkFilingExternalDocument } from './saveWorkItemForDocketClerkFilingExternalDocument';

describe('saveWorkItemForDocketClerkFilingExternalDocument', () => {
  let putStub;
  let getStub;

  beforeEach(() => {
    putStub = jest.fn().mockReturnValue({
      promise: () =>
        Promise.resolve({
          section: DOCKET_SECTION,
          userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        }),
    });
    getStub = jest.fn().mockReturnValue({
      promise: () =>
        Promise.resolve({
          Item: {
            section: DOCKET_SECTION,
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
        }),
    });
  });

  it('invokes the persistence layer 5 times to store the work item, user and section outbox records, and work item mapping record', async () => {
    const timestamp = createISODateString();
    applicationContext.getCurrentUser.mockReturnValue({
      section: DOCKET_SECTION,
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getDocumentClient.mockReturnValue({
      get: getStub,
      put: putStub,
    });
    await saveWorkItemForDocketClerkFilingExternalDocument({
      applicationContext,
      workItem: {
        assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        completedAt: timestamp,
        docketNumber: '456-20',
        section: DOCKET_SECTION,
        workItemId: '123',
      } as any,
    });

    expect(putStub.mock.calls).toEqual(
      expect.arrayContaining([
        // section outbox
        expect.arrayContaining([
          expect.objectContaining({
            Item: expect.objectContaining({
              gsi1pk: 'work-item|123',
              pk: 'section-outbox|docket',
              sk: timestamp,
              workItemId: '123',
            }),
          }),
        ]),
        // section outbox archive
        expect.arrayContaining([
          expect.objectContaining({
            Item: expect.objectContaining({
              gsi1pk: 'work-item|123',
              pk: expect.anything(),
              sk: timestamp,
              workItemId: '123',
            }),
          }),
        ]),
        // user outbox
        expect.arrayContaining([
          expect.objectContaining({
            Item: expect.objectContaining({
              gsi1pk: 'work-item|123',
              pk: 'user-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
              sk: timestamp,
              workItemId: '123',
            }),
          }),
        ]),
        // user outbox archive
        expect.arrayContaining([
          expect.objectContaining({
            Item: expect.objectContaining({
              gsi1pk: 'work-item|123',
              pk: expect.anything(),
              sk: timestamp,
              workItemId: '123',
            }),
          }),
        ]),
        // main work item associated with case
        expect.arrayContaining([
          expect.objectContaining({
            Item: expect.objectContaining({
              gsi1pk: 'work-item|123',
              pk: 'case|456-20',
              sk: 'work-item|123',
              workItemId: '123',
            }),
          }),
        ]),
      ]),
    );
  });
});
