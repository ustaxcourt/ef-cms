import { formattedCaseMessages as formattedCaseMessagesComputed } from '../../src/presenter/computeds/formattedCaseMessages';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseMessages = withAppContextDecorator(
  formattedCaseMessagesComputed,
);

export const petitionsClerkViewsInProgressMessagesOnCaseDetail =
  cerebralTest => {
    return it('petitions clerk views in-progress messages on the case detail page', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      expect(cerebralTest.getState('caseDetail.messages').length).toEqual(4);

      const messagesFormatted = runCompute(formattedCaseMessages, {
        state: cerebralTest.getState(),
      });
      expect(messagesFormatted.inProgressMessages.length).toEqual(2);
      expect(messagesFormatted.completedMessages.length).toEqual(0);
    });
  };
