import { formattedMessageDetail as formattedMessageDetailComputed } from '../../src/presenter/computeds/formattedMessageDetail';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedMessageDetail = withAppContextDecorator(
  formattedMessageDetailComputed,
);

export const docketClerkCompletesMessageThread = cerebralTest => {
  return it('docket clerk completes message thread', async () => {
    await cerebralTest.runSequence('openCompleteMessageModalSequence');

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'form.message',
      value: 'Win, Win, Win, Win',
    });

    await cerebralTest.runSequence('completeMessageSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('messageDetail').length).toEqual(3);

    const messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: cerebralTest.getState(),
    });
    expect(messageDetailFormatted.isCompleted).toEqual(true);

    await refreshElasticsearchIndex();

    //message should no longer be shown in inbox
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    let messages = cerebralTest.getState('messages');

    let foundMessage = messages.find(
      message => message.subject === cerebralTest.testMessageSubject,
    );

    expect(foundMessage).not.toBeDefined();

    //message thread should be shown in completed box
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'completed',
      queue: 'my',
    });

    messages = cerebralTest.getState('messages');

    foundMessage = messages.find(
      message => message.subject === cerebralTest.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();
  });
};
