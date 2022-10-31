import { DOCKET_SECTION } from '../../../business/entities/EntityConstants';
import { applicationContext } from '../../../business/test/createTestApplicationContext';
import { putWorkItemInUsersOutbox } from './putWorkItemInUsersOutbox';

describe('putWorkItemInUsersOutbox', () => {
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

  it('invokes the persistence layer with pk of user-outbox|{userId} and section-outbox|{section} and other expected params', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      section: DOCKET_SECTION,
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getDocumentClient.mockReturnValue({
      get: getStub,
      put: putStub,
    });
    await putWorkItemInUsersOutbox({
      applicationContext,
      section: DOCKET_SECTION,
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      workItem: {
        workItemId: '123',
      },
    });
    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        pk: 'user-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
        workItemId: '123',
      },
    });
    expect(putStub.mock.calls[1][0]).toMatchObject({
      Item: {
        pk: 'section-outbox|docket',
        workItemId: '123',
      },
    });
  });
});
