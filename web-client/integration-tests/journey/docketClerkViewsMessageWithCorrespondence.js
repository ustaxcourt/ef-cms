import { getCaseMessagesForCase } from '../helpers';
import { messageDocumentHelper as messageDocumentHelperComputed } from '../../src/presenter/computeds/messageDocumentHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkViewsMessageWithCorrespondence = test => {
  const messageDocumentHelper = withAppContextDecorator(
    messageDocumentHelperComputed,
  );

  const getHelper = () => {
    return runCompute(messageDocumentHelper, {
      state: test.getState(),
    });
  };

  it('Docket clerk views case message with correspondence attached', async () => {
    const formattedCaseMessages = await getCaseMessagesForCase(test);
    expect(formattedCaseMessages.inProgressMessages.length).toBe(1);

    await test.runSequence('gotoMessageDetailSequence', {
      docketNumber: test.docketNumber,
      parentMessageId:
        formattedCaseMessages.inProgressMessages[0].parentMessageId,
    });

    expect(getHelper().showEditCorrespondenceButton).toBe(true);
  });
};
