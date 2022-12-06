import { DOCKET_SECTION } from '../../shared/src/business/entities/EntityConstants';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';
import { formattedMessageDetail as formattedMessageDetailComputed } from '../src/presenter/computeds/formattedMessageDetail';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  waitForCondition,
} from './helpers';
import { messageModalHelper as messageModalHelperComputed } from '../src/presenter/computeds/messageModalHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Docket clerk serves order from message journey', () => {
  const cerebralTest = setupTest();

  beforeAll(() => {
    jest.setTimeout(40000);
    jest.spyOn(
      cerebralTest.applicationContext.getUseCases(),
      'createMessageInteractor',
    );
    cerebralTest.docketNumber = '320-21';
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');

  it('send message to docketClerk with draft order as attachment', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('openCreateMessageModalSequence');

    const messageModalHelper = withAppContextDecorator(
      messageModalHelperComputed,
    );

    const getHelper = () => {
      return runCompute(messageModalHelper, {
        state: cerebralTest.getState(),
      });
    };

    await cerebralTest.runSequence(
      'updateSectionInCreateMessageModalSequence',
      {
        key: 'toSection',
        value: DOCKET_SECTION,
      },
    );

    await cerebralTest.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '1805d1ab-18d0-43ec-bafb-654e83405416', // docketClerk
    });

    await cerebralTest.runSequence('updateMessageModalAttachmentsSequence', {
      documentId: 'd4a9662b-ca30-4bf4-b7fd-a3c976a84fb7',
    });

    cerebralTest.testMessageSubject = `Please serve this document (${Date.now()})`;

    await cerebralTest.runSequence('updateModalFormValueSequence', {
      key: 'subject',
      value: cerebralTest.testMessageSubject,
    });

    await cerebralTest.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value:
        'Verify that the Date column value matches the Served column value in the Docket Record.',
    });

    await cerebralTest.runSequence('createMessageSequence');

    await cerebralTest.applicationContext
      .getUseCases()
      .createMessageInteractor.mock.results[0].value.then(message => {
        cerebralTest.lastCreatedMessage = message;
      });

    expect(cerebralTest.getState('modal.form')).toBeDefined();
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();
  });

  loginAs(cerebralTest, 'docketclerk@example.com');

  it('docket clerk views the forwarded message they were sent in their inbox', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = cerebralTest.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === cerebralTest.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();
    expect(foundMessage.from).toEqual('Test Petitionsclerk');
  });

  it('docket clerk adds docket entry for order from a message', async () => {
    await cerebralTest.runSequence('gotoMessageDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
      parentMessageId: cerebralTest.lastCreatedMessage.messageId,
    });

    const formattedMessageDetail = withAppContextDecorator(
      formattedMessageDetailComputed,
    );

    let messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: cerebralTest.getState(),
    });

    const orderDocument = messageDetailFormatted.attachments[0];
    expect(orderDocument.documentTitle).toEqual('Order that is a draft');

    await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.documentId,
      docketNumber: cerebralTest.docketNumber,
      redirectUrl: `/messages/${cerebralTest.docketNumber}/message-detail/${cerebralTest.lastCreatedMessage.messageId}?documentId=${orderDocument.documentId}`,
    });

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'serviceStamp',
        value: 'Served',
      },
    );

    await cerebralTest.runSequence(
      'openConfirmInitiateCourtIssuedFilingServiceModalSequence',
    );

    await cerebralTest.runSequence(
      'fileAndServeCourtIssuedDocumentFromDocketEntrySequence',
    );

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'MessageDetail',
    });

    expect(cerebralTest.getState('currentPage')).toEqual('MessageDetail');

    const formattedCaseDetail = withAppContextDecorator(
      formattedCaseDetailComputed,
    );

    const caseDetailFormatted = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    const caseOrderDocketEntry =
      caseDetailFormatted.formattedDocketEntries.find(
        d => d.docketEntryId === orderDocument.documentId,
      );

    expect(caseOrderDocketEntry).toBeDefined();
    expect(caseOrderDocketEntry.isOnDocketRecord).toEqual(true);
    expect(caseOrderDocketEntry.createdAtFormatted).toEqual(
      caseOrderDocketEntry.servedAtFormatted,
    );
  });
});
