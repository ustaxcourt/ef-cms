import { InitialWorkItemMessage } from '../../../shared/src/business/entities/InitialWorkItemMessage';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

const { VALIDATION_ERROR_MESSAGES } = InitialWorkItemMessage;
const { ADC_SECTION } = applicationContext.getConstants();

export const docketClerkStartsNewMessageThreadOnStipulatedDecisionToADC = test => {
  return it('Docket clerk starts a new message thread on the Stipulated Decision document to adc', async () => {
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: test.stipulatedDecisionDocumentId,
    });

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('createWorkItemSequence');

    expect(test.getState('validationErrors')).toEqual({
      assigneeId: VALIDATION_ERROR_MESSAGES.assigneeId,
      message: VALIDATION_ERROR_MESSAGES.message,
      section: VALIDATION_ERROR_MESSAGES.section,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'section',
      value: 'adc',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'assigneeId',
      value: '6805d1ab-18d0-43ec-bafb-654e83405416', // adc
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'message',
      value: 'this is a new thread test message to an adc',
    });

    await test.runSequence('createWorkItemSequence');

    const documents = test.getState('caseDetail.documents');
    const stipulatedDecision = documents.find(
      document => document.documentId === test.stipulatedDecisionDocumentId,
    );
    const workItem = stipulatedDecision.workItems.find(
      workItem => workItem.assigneeName === 'Test ADC',
    );

    test.stipulatedDecisionWorkItemId = workItem.workItemId;
    expect(workItem).toMatchObject({
      assigneeName: 'Test ADC',
      isInitializeCase: false,
      messages: [
        {
          from: 'Test Docketclerk',
          fromUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'this is a new thread test message to an adc',
          to: 'Test ADC',
          toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
      section: ADC_SECTION,
      sentBy: 'Test Docketclerk',
    });

    expect(test.getState('form')).toEqual({});

    await test.runSequence('gotoDashboardSequence');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'my',
    });
    let sectionOutboxWorkQueue = test.getState('workQueue');
    let answerWorkItem = sectionOutboxWorkQueue.find(
      workItem => workItem.workItemId === test.stipulatedDecisionWorkItemId,
    );
    expect(answerWorkItem.messages[0]).toMatchObject({
      message: 'this is a new thread test message to an adc',
    });
  });
};
