import { formattedMessageDetail as formattedMessageDetailComputed } from '../../src/presenter/computeds/formattedMessageDetail';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedMessageDetail = withAppContextDecorator(
  formattedMessageDetailComputed,
);

export const docketClerkCompletesMessageThread = test => {
  return it('docket clerk completes message thread', async () => {
    await test.runSequence('openCompleteMessageModalSequence');

    await test.runSequence('updateModalValueSequence', {
      key: 'form.message',
      value: 'Win, Win, Win, Win',
    });

    await test.runSequence('completeCaseMessageSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('messageDetail').length).toEqual(3);

    const messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: test.getState(),
    });
    expect(messageDetailFormatted.isCompleted).toEqual(true);

    await refreshElasticsearchIndex();

    //message should no longer be shown in inbox
    await test.runSequence('gotoCaseMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    let messages = test.getState('messages');

    let foundMessage = messages.find(
      message => message.subject === test.testMessageSubject,
    );

    expect(foundMessage).not.toBeDefined();

    //message thread should be shown in completed box
    await test.runSequence('gotoCaseMessagesSequence', {
      box: 'completed',
      queue: 'my',
    });

    messages = test.getState('messages');

    foundMessage = messages.find(
      message => message.subject === test.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();
  });
};
