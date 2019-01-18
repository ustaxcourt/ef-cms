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
        message: 'A Petition filed by Petitioner is ready for review.',
        sentBy: 'Test Petitionsclerk',
      },
      {
        assigneeId: null,
        message: 'A Answer filed by Respondent is ready for review.',
        sentBy: 'Test Respondent',
      },
      {
        assigneeId: null,
        message:
          'A Stipulated Decision filed by Respondent is ready for review.',
        sentBy: 'Test Respondent',
      },
    ]);
  });
};
