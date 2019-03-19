import { extractedPendingMessagesFromCaseDetail } from '../../src/presenter/computeds/extractPendingMessagesFromCaseDetail';
import { runCompute } from 'cerebral/test';
import { orderBy } from 'lodash';

export default test => {
  return it('Docketclerk views case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    let result = runCompute(extractedPendingMessagesFromCaseDetail, {
      state: test.getState(),
    });
    result = result.map(message => ({
      assigneeId: message.assigneeId,
      createdAt: message.currentMessage.createdAt,
      from: message.currentMessage.from,
      fromUserId: message.currentMessage.fromUserId,
      message: message.currentMessage.message,
    }));
    expect(orderBy(result, 'message')).toMatchObject(
      orderBy(
        [
          {
            assigneeId: null,
            from: 'Test Respondent',
            fromUserId: '5805d1ab-18d0-43ec-bafb-654e83405416',
            message:
              'Stipulated Decision filed by Respondent is ready for review.',
          },
          {
            assigneeId: null,
            from: 'Test Respondent',
            fromUserId: '5805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Answer filed by Respondent is ready for review.',
          },
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
            message:
              'Stipulated Decision filed by Respondent is ready for review.',
          },
        ],
        'message',
      ),
    );
  });
};
