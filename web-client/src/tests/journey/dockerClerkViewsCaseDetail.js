import { runCompute } from 'cerebral/test';

import { extractedPendingMessagesFromCaseDetail } from '../../presenter/computeds/extractPendingMessagesFromCaseDetail';

export default test => {
  return it('Docketclerk views case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(
      runCompute(extractedPendingMessagesFromCaseDetail, {
        state: test.getState(),
      }).map(message => ({
        message: message.currentMessage.message,
        sentBy: message.currentMessage.sentBy,
        assigneeId: message.assigneeId,
      })),
    ).toMatchObject([
      {
        assigneeId: 'petitionsclerk1',
        message: 'The work item was assigned.',
        sentBy: 'Test Petitionsclerk',
      },
      {
        assigneeId: null,
        message: 'a Answer filed by respondent is ready for review',
        sentBy: 'Test Respondent',
      },
      {
        assigneeId: null,
        message:
          'a Stipulated Decision filed by respondent is ready for review',
        sentBy: 'Test Respondent',
      },
    ]);
  });
};
