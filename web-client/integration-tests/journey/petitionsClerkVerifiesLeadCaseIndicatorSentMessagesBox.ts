import { formattedMessages as formattedMessagesComputed } from '../../src/presenter/computeds/formattedMessages';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkVerifiesLeadCaseIndicatorSentMessagesBox = (
  cerebralTest,
  { docketNumber },
) => {
  const formattedMessages = withAppContextDecorator(formattedMessagesComputed);

  return it('petitions clerk verifies lead case indicator sent messages box', async () => {
    await refreshElasticsearchIndex();
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'outbox',
      queue: 'section',
    });

    const sectionOutboxMessages = runCompute(formattedMessages, {
      state: cerebralTest.getState(),
    });

    const foundMessage = sectionOutboxMessages.messages.find(
      message => message.docketNumber === docketNumber,
    );

    expect(foundMessage).toMatchObject({
      consolidatedIconTooltipText: 'Lead case',
      inConsolidatedGroup: true,
      isLeadCase: true,
    });
  });
};
