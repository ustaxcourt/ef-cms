import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkCompletesDocketEntryQcAndSendsMessage =
  cerebralTest => {
    return it('docketclerk completes docket entry QC for the proposed stipulated decision and sends a message to the ADC', async () => {
      await cerebralTest.runSequence('chooseWorkQueueSequence', {
        box: 'inbox',
        queue: 'my',
      });
      let workQueueFormatted = runCompute(formattedWorkQueue, {
        state: cerebralTest.getState(),
      });

      const proposedStipulatedDecision = workQueueFormatted.find(
        workItem => workItem.docketNumber === cerebralTest.docketNumber,
      );
      cerebralTest.proposedStipDecisionDocketEntryId =
        proposedStipulatedDecision.docketEntry.docketEntryId;

      expect(proposedStipulatedDecision.isRead).toBeFalsy();

      await cerebralTest.runSequence('gotoDocketEntryQcSequence', {
        docketEntryId: proposedStipulatedDecision.docketEntry.docketEntryId,
        docketNumber: cerebralTest.docketNumber,
      });

      await refreshElasticsearchIndex();

      await cerebralTest.runSequence('chooseWorkQueueSequence', {
        box: 'inbox',
        queue: 'my',
      });

      workQueueFormatted = runCompute(formattedWorkQueue, {
        state: cerebralTest.getState(),
      });

      const readWorkItem = workQueueFormatted.find(
        workItem => workItem.docketNumber === cerebralTest.docketNumber,
      );

      expect(readWorkItem.isRead).toEqual(true);

      await cerebralTest.runSequence('openCompleteAndSendMessageModalSequence');
      expect(cerebralTest.getState('validationErrors')).toEqual({});
      expect(cerebralTest.getState('modal.form.attachments').length).toEqual(1);

      await cerebralTest.runSequence('updateModalFormValueSequence', {
        key: 'toSection',
        value: 'adc',
      });

      await cerebralTest.runSequence('updateModalFormValueSequence', {
        key: 'toUserId',
        value: '6805d1ab-18d0-43ec-bafb-654e83405416', //adc
      });

      await cerebralTest.runSequence('updateModalFormValueSequence', {
        key: 'message',
        value: 'please sign this',
      });

      cerebralTest.testMessageSubject = `your message, ma'am ${Date.now()}`;

      await cerebralTest.runSequence('updateModalFormValueSequence', {
        key: 'subject',
        value: cerebralTest.testMessageSubject,
      });

      await cerebralTest.runSequence(
        'completeDocketEntryQCAndSendMessageSequence',
      );

      await refreshElasticsearchIndex();
    });
  };
