import { runCompute } from 'cerebral/test';

import { extractedPendingMessagesFromCaseDetail } from './extractPendingMessagesFromCaseDetail';

describe('extractPendingMessagesFromCaseDetail', () => {
  it('should no fail if work items is not defined', async () => {
    const result = await runCompute(extractedPendingMessagesFromCaseDetail, {
      state: {
        caseDetail: {
          documents: [{}],
        },
      },
    });
    expect(result).toMatchObject([]);
  });

  it('sorts the workQueue by the latest currentMessage for each work item', async () => {
    const result = await runCompute(extractedPendingMessagesFromCaseDetail, {
      state: {
        caseDetail: {
          documents: [
            {
              workItems: [
                {
                  caseStatus: 'new',
                  messages: [
                    {
                      createdAt: '2018-03-01T00:00:00.000Z',
                      message: 'there',
                      messageId: 'gl',
                    },
                    {
                      createdAt: '2018-03-02T00:00:00.000Z',
                      message: 'is',
                      messageId: 'a',
                    },
                    {
                      createdAt: '2018-03-03T00:00:00.000Z',
                      message: 'no',
                      messageId: 'b',
                    },
                    {
                      createdAt: '2018-03-04T00:00:00.000Z',
                      message: 'level',
                      messageId: 'c',
                    },
                  ],
                  workItemId: '1',
                },
                {
                  caseStatus: 'new',
                  messages: [
                    {
                      createdAt: '2018-02-01T00:00:00.000Z',
                      message: 'yup',
                      messageId: '1',
                    },
                    {
                      createdAt: '2018-03-01T00:00:00.000Z',
                      message: 'nope',
                      messageId: '2',
                    },
                    {
                      createdAt: '2018-04-01T00:00:00.000Z',
                      message: 'gg',
                      messageId: '3',
                    },
                  ],
                  workItemId: '2',
                },
              ],
            },
          ],
        },
      },
    });
    expect(result).toMatchObject([
      {
        currentMessage: {
          message: 'gg',
        },
        workItemId: '2',
      },
      {
        currentMessage: {
          message: 'level',
        },
        workItemId: '1',
      },
    ]);
  });

  it('should filter out the batched for IRS messages', async () => {
    const result = await runCompute(extractedPendingMessagesFromCaseDetail, {
      state: {
        caseDetail: {
          documents: [
            {
              workItems: [
                {
                  caseStatus: 'new',
                  messages: [
                    {
                      message: 'batched for IRS',
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    });
    expect(result).toMatchObject([]);
  });
});
