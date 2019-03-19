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
