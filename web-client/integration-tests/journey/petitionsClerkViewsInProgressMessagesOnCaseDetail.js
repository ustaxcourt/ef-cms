import { formattedCaseMessages as formattedCaseMessagesComputed } from '../../src/presenter/computeds/formattedCaseMessages';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseMessages = withAppContextDecorator(
  formattedCaseMessagesComputed,
);

export const petitionsClerkViewsInProgressMessagesOnCaseDetail = test => {
  return it('petitions clerk views in-progress messages on the case detail page', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('caseDetail.messages').length).toEqual(4);

    const messagesFormatted = runCompute(formattedCaseMessages, {
      state: test.getState(),
    });
    expect(messagesFormatted.inProgressMessages.length).toEqual(2);
    expect(messagesFormatted.completedMessages.length).toEqual(0);
  });
};
