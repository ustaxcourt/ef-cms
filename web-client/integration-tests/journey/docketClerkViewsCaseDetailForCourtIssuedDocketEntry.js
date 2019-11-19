import { extractedPendingMessagesFromCaseDetail as extractedPendingMessagesFromCaseDetailComputed } from '../../src/presenter/computeds/extractPendingMessagesFromCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const extractedPendingMessagesFromCaseDetail = withAppContextDecorator(
  extractedPendingMessagesFromCaseDetailComputed,
);

export default (test, expectedCount = 1) => {
  return it('Docketclerk views case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const result = runCompute(extractedPendingMessagesFromCaseDetail, {
      state: test.getState(),
    });

    expect(result.length).toEqual(expectedCount);
  });
};
