import { ForwardMessage } from '../../../shared/src/business/entities/ForwardMessage';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { orderBy } from 'lodash';

const { VALIDATION_ERROR_MESSAGES } = ForwardMessage;
const { ADC_SECTION } = applicationContext.getConstants();

export const docketClerkForwardWorkItem = test => {
  return it('Docket clerk forward work item', async () => {
    await test.runSequence('validateForwardMessageSequence', {
      workItemId: test.workItemId,
    });

    await test.runSequence('submitForwardSequence', {
      workItemId: test.workItemId,
    });

    await test.runSequence('updateForwardFormValueSequence', {
      form: `form.${test.workItemId}`,
      key: 'section',
      section: 'chambers',
      value: 'chambers',
      workItemId: test.workItemId,
    });

    await test.runSequence('validateForwardMessageSequence', {
      workItemId: test.workItemId,
    });

    expect(
      test.getState(`validationErrors.${test.workItemId}.assigneeId`),
    ).toEqual(VALIDATION_ERROR_MESSAGES.assigneeId);

    await test.runSequence('updateForwardFormValueSequence', {
      form: `form.${test.workItemId}`,
      key: 'chambers',
      section: 'chambered',
      value: 'chambered',
      workItemId: test.workItemId,
    });

    expect(test.getState(`form.${test.workItemId}.section`)).toEqual(
      'chambered',
    );

    test.setState('form', {
      [test.workItemId]: {
        assigneeId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        forwardMessage: 'hello world',
        section: ADC_SECTION,
      },
    });

    await test.runSequence('submitForwardSequence', {
      workItemId: test.workItemId,
    });

    const caseDetail = test.getState('caseDetail');
    let workItem;
    caseDetail.documents.forEach(document =>
      document.workItems.forEach(item => {
        if (item.workItemId === test.workItemId) {
          workItem = item;
        }
      }),
    );
    expect(workItem).toMatchObject({
      assigneeId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test ADC',
    });
    const messages = orderBy(workItem.messages, 'createdAt', 'desc');
    expect(messages.length).toEqual(2);
    expect(messages[0]).toMatchObject({
      from: 'Test Docketclerk',
      fromUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      message: 'hello world',
    });
  });
};
