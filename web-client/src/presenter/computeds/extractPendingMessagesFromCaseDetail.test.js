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
});
