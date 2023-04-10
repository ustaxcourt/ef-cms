import { getCaseMessagesForCase } from '../helpers';
import { messageDocumentHelper as messageDocumentHelperComputed } from '../../src/presenter/computeds/messageDocumentHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkViewsMessageWithCorrespondence = cerebralTest => {
  const messageDocumentHelper = withAppContextDecorator(
    messageDocumentHelperComputed,
  );

  const getHelper = () => {
    return runCompute(messageDocumentHelper, {
      state: cerebralTest.getState(),
    });
  };

  it('Docket clerk views case message with correspondence attached', async () => {
    const formattedCaseMessages = await getCaseMessagesForCase(cerebralTest);
    expect(formattedCaseMessages.inProgressMessages.length).toBe(1);

    await cerebralTest.runSequence('gotoMessageDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
      parentMessageId:
        formattedCaseMessages.inProgressMessages[0].parentMessageId,
    });

    expect(getHelper().showEditCorrespondenceButton).toBe(true);
  });
};
