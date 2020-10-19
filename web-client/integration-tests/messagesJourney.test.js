import { NewMessage } from '../../shared/src/business/entities/NewMessage';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { docketClerkAddsDocketEntryFromMessage } from './journey/docketClerkAddsDocketEntryFromMessage';
import { docketClerkAppliesSignatureFromMessage } from './journey/docketClerkAppliesSignatureFromMessage';
import { docketClerkCompletesMessageThread } from './journey/docketClerkCompletesMessageThread';
import { docketClerkEditsOrderFromMessage } from './journey/docketClerkEditsOrderFromMessage';
import { docketClerkRemovesSignatureFromMessage } from './journey/docketClerkRemovesSignatureFromMessage';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import { docketClerkViewsCompletedMessagesOnCaseDetail } from './journey/docketClerkViewsCompletedMessagesOnCaseDetail';
import { docketClerkViewsForwardedMessageInInbox } from './journey/docketClerkViewsForwardedMessageInInbox';
import { formattedMessageDetail as formattedMessageDetailComputed } from '../src/presenter/computeds/formattedMessageDetail';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { messageModalHelper as messageModalHelperComputed } from '../src/presenter/computeds/messageModalHelper';
import { petitionsClerk1CreatesNoticeFromMessageDetail } from './journey/petitionsClerk1CreatesNoticeFromMessageDetail';
import { petitionsClerk1RepliesToMessage } from './journey/petitionsClerk1RepliesToMessage';
import { petitionsClerk1VerifiesCaseStatusOnMessage } from './journey/petitionsClerk1VerifiesCaseStatusOnMessage';
import { petitionsClerk1ViewsMessageDetail } from './journey/petitionsClerk1ViewsMessageDetail';
import { petitionsClerk1ViewsMessageInbox } from './journey/petitionsClerk1ViewsMessageInbox';
import { petitionsClerkCreatesNewMessageOnCaseWithMaxAttachments } from './journey/petitionsClerkCreatesNewMessageOnCaseWithMaxAttachments';
import { petitionsClerkCreatesOrderFromMessage } from './journey/petitionsClerkCreatesOrderFromMessage';
import { petitionsClerkForwardsMessageToDocketClerk } from './journey/petitionsClerkForwardsMessageToDocketClerk';
import { petitionsClerkViewsInProgressMessagesOnCaseDetail } from './journey/petitionsClerkViewsInProgressMessagesOnCaseDetail';
import { petitionsClerkViewsReplyInInbox } from './journey/petitionsClerkViewsReplyInInbox';
import { petitionsClerkViewsSentMessagesBox } from './journey/petitionsClerkViewsSentMessagesBox';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const test = setupTest();
const { STATUS_TYPES } = applicationContext.getConstants();

describe('messages journey', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  loginAs(test, 'petitioner@example.com');
  it('Create test case to send messages', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    test.documentId = caseDetail.docketEntries[0].docketEntryId;
  });

  // loginAs(test, 'petitionsclerk@example.com');
  // petitionsClerkCreatesNewMessageOnCaseWithMaxAttachments(test);
  // createNewMessageOnCase(test);
  // petitionsClerkViewsSentMessagesBox(test);
  // petitionsClerk1VerifiesCaseStatusOnMessage(test, STATUS_TYPES.new);

  // loginAs(test, 'docketclerk1@example.com');
  // docketClerkUpdatesCaseStatusToReadyForTrial(test);

  // loginAs(test, 'petitionsclerk1@example.com');
  // petitionsClerk1ViewsMessageInbox(test);
  // petitionsClerk1VerifiesCaseStatusOnMessage(
  //   test,
  //   STATUS_TYPES.generalDocketReadyForTrial,
  // );
  // petitionsClerk1ViewsMessageDetail(test);
  // petitionsClerk1RepliesToMessage(test);

  // loginAs(test, 'petitionsclerk@example.com');
  // petitionsClerkViewsReplyInInbox(test);
  // petitionsClerkCreatesOrderFromMessage(test);
  // petitionsClerkForwardsMessageToDocketClerk(test);
  // petitionsClerkViewsInProgressMessagesOnCaseDetail(test);

  // loginAs(test, 'docketclerk@example.com');
  // docketClerkViewsForwardedMessageInInbox(test);
  // docketClerkEditsOrderFromMessage(test);
  // docketClerkAppliesSignatureFromMessage(test);
  // docketClerkRemovesSignatureFromMessage(test);
  // docketClerkAppliesSignatureFromMessage(test);
  // docketClerkAddsDocketEntryFromMessage(test);
  // docketClerkCompletesMessageThread(test);
  // docketClerkViewsCompletedMessagesOnCaseDetail(test);

  // loginAs(test, 'petitionsclerk1@example.com');
  // petitionsClerkCreatesNewMessageOnCaseWithMaxAttachments(test);
  // createNewMessageOnCase(test);
  // petitionsClerk1ViewsMessageInbox(test);
  // petitionsClerk1ViewsMessageDetail(test);
  // petitionsClerk1CreatesNoticeFromMessageDetail(test);

  loginAs(test, 'docketclerk@example.com');
  it('do things for bug fix', async () => {
    const { DOCKET_SECTION } = applicationContext.getConstants();

    const messageModalHelper = withAppContextDecorator(
      messageModalHelperComputed,
    );

    const formattedMessageDetail = withAppContextDecorator(
      formattedMessageDetailComputed,
    );

    const getHelper = () => {
      return runCompute(messageModalHelper, {
        state: test.getState(),
      });
    };

    //create a new message with petition attached
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openCreateMessageModalSequence');

    await test.runSequence('updateSectionInCreateMessageModalSequence', {
      key: 'toSection',
      value: DOCKET_SECTION,
    });

    await test.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '1805d1ab-18d0-43ec-bafb-654e83405416', //docketclerk
    });

    const messageDocument = getHelper().documents[0];
    test.testMessageDocumentId = messageDocument.docketEntryId;

    await test.runSequence('updateMessageModalAttachmentsSequence', {
      documentId: test.testMessageDocumentId,
    });

    expect(test.getState('modal.form.subject')).toEqual(
      messageDocument.documentTitle || messageDocument.documentType,
    );

    test.testMessageSubject = `this is a buggy message ${Date.now()}`;

    await test.runSequence('updateModalFormValueSequence', {
      key: 'subject',
      value: test.testMessageSubject,
    });

    await test.runSequence('createMessageSequence');

    expect(test.getState('validationErrors')).toEqual({
      message: NewMessage.VALIDATION_ERROR_MESSAGES.message,
    });

    await test.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value: 'borked borked borked',
    });

    await test.runSequence('createMessageSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();

    await test.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = test.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === test.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();

    test.testMessageDocumentId = foundMessage.attachments[0].documentId;
    test.parentMessageId = foundMessage.parentMessageId;

    //view message detail
    await test.runSequence('gotoMessageDetailSequence', {
      docketNumber: test.docketNumber,
      parentMessageId: test.parentMessageId,
    });

    expect(test.getState('messageDetail')).toMatchObject([
      {
        parentMessageId: test.parentMessageId,
      },
    ]);

    // create order from message screen (CLICK LINK, FILL FORM, SIGN DOC)
    await test.runSequence('openCreateOrderChooseTypeModalSequence', {
      parentMessageId: test.parentMessageId,
    });

    await test.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'eventCode',
      value: 'O',
    });

    await test.runSequence('submitCreateOrderModalSequence');

    await test.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is a test order for a buggy test.</p>',
    });

    await test.runSequence('submitCourtIssuedOrderSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('pdfPreviewUrl')).toBeDefined();

    await test.runSequence('setPDFSignatureDataSequence', {
      signatureData: {
        scale: 1,
        x: 100,
        y: 100,
      },
    });
    await test.runSequence('saveDocumentSigningSequence');

    expect(test.getState('currentPage')).toEqual('MessageDetail');

    test.selectedMessageAttachmentId = test.getState(
      'viewerDocumentToDisplay.documentId',
    );

    const messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: test.getState(),
    });
    expect(messageDetailFormatted.attachments.length).toEqual(2);
    expect(messageDetailFormatted.attachments[1]).toMatchObject({
      documentTitle: 'Order',
    });

    //add docket entry for order from message detail (CLICK LINK, FILL FORM, SAVE ENTRY)
    await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: test.selectedMessageAttachmentId,
      docketNumber: test.docketNumber,
      redirectUrl: `/messages/${test.docketNumber}/message-detail/${test.parentMessageId}`,
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'something buggy in this test',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'serviceStamp',
      value: 'Served',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'O',
    });

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('currentPage')).toEqual('MessageDetail');

    //verify that state viewerDocument to display is newly created docket entry

    expect(test.getState('viewerDocumentToDisplay.documentId')).toBe(
      test.selectedMessageAttachmentId,
    );
  });
});
