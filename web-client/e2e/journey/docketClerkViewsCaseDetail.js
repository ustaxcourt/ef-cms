import { runCompute } from 'cerebral/test';

import { extractedPendingMessagesFromCaseDetail } from '../../src/presenter/computeds/extractPendingMessagesFromCaseDetail';

export default test => {
  return it('Docketclerk views case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(
      runCompute(extractedPendingMessagesFromCaseDetail, {
        state: test.getState(),
      }).map(message => ({
        assigneeId: message.assigneeId,
        from: message.currentMessage.from,
        fromUserId: message.currentMessage.fromUserId,
        message: message.currentMessage.message,
      })),
    ).toMatchObject([
      {
        assigneeId: '63784910-c1af-4476-8988-a02f92da8e09',
        from: 'Test Petitionsclerk1',
        fromUserId: '4805d1ab-18d0-43ec-bafb-654e83405416',
        message: 'Petition batched for IRS',
      },
      {
        assigneeId: null,
        from: 'Test Respondent',
        fromUserId: '5805d1ab-18d0-43ec-bafb-654e83405416',
        message: 'A Answer filed by Respondent is ready for review.',
      },
      {
        assigneeId: null,
        from: 'Test Respondent',
        fromUserId: '5805d1ab-18d0-43ec-bafb-654e83405416',
        message:
          'A Stipulated Decision filed by Respondent is ready for review.',
      },
    ]);
  });
};
