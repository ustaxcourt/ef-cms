import { extractedPendingMessagesFromCaseDetail as extractPendingMessagesFromCaseDetailComputed } from './extractPendingMessagesFromCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

import {
  createISODateString,
  formatDateString,
  prepareDateFromString,
} from '../../../../shared/src/business/utilities/DateHandler';

const extractedPendingMessagesFromCaseDetail = withAppContextDecorator(
  extractPendingMessagesFromCaseDetailComputed,
  {
    getCurrentUser: () => ({
      role: 'petitionsclerk',
    }),
    getUtilities: () => {
      return {
        createISODateString,
        formatDateString,
        prepareDateFromString,
      };
    },
  },
);

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
                  document: {
                    createdAt: '2018-03-02T05:00:00.000Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-03-01T05:00:00.000Z',
                      message: 'there',
                      messageId: 'gl',
                    },
                    {
                      createdAt: '2018-03-02T05:00:00.000Z',
                      message: 'is',
                      messageId: 'a',
                    },
                    {
                      createdAt: '2018-03-03T05:00:00.000Z',
                      message: 'no',
                      messageId: 'b',
                    },
                    {
                      createdAt: '2018-03-04T05:00:00.000Z',
                      message: 'level',
                      messageId: 'c',
                    },
                  ],
                  workItemId: '1',
                },
                {
                  caseStatus: 'new',
                  document: {
                    createdAt: '2018-03-02T05:00:00.000Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-02-01T05:00:00.000Z',
                      message: 'yup',
                      messageId: '1',
                    },
                    {
                      createdAt: '2018-03-01T05:00:00.000Z',
                      message: 'nope',
                      messageId: '2',
                    },
                    {
                      createdAt: '2018-04-01T05:00:00.000Z',
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
                  document: {
                    createdAt: '2018-03-02T00:00:00.000Z',
                  },
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
