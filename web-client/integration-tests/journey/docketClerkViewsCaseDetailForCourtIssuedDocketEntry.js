import { extractedPendingMessagesFromCaseDetail as extractedPendingMessagesFromCaseDetailComputed } from '../../src/presenter/computeds/extractPendingMessagesFromCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const extractedPendingMessagesFromCaseDetail = withAppContextDecorator(
  extractedPendingMessagesFromCaseDetailComputed,
);

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
    expect(result).toMatchObject([
      {
        assigneeId: null,
        from: 'Test Petitioner',
        fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        message:
          'Petition filed by Test Person, Deceased, Test Person 2, Surviving Spouse is ready for review.',
      },
    ]);
  });
};
