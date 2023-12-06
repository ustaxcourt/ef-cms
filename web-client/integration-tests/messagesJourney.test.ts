import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { docketClerkAddsDocketEntryFromMessage } from './journey/docketClerkAddsDocketEntryFromMessage';
import { docketClerkAppliesSignatureFromMessage } from './journey/docketClerkAppliesSignatureFromMessage';
import { docketClerkCompletesMessageThread } from './journey/docketClerkCompletesMessageThread';
import { docketClerkEditsOrderFromMessage } from './journey/docketClerkEditsOrderFromMessage';
import { docketClerkRemovesSignatureFromMessage } from './journey/docketClerkRemovesSignatureFromMessage';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import { docketClerkViewsCompletedMessagesOnCaseDetail } from './journey/docketClerkViewsCompletedMessagesOnCaseDetail';
import { docketClerkViewsForwardedMessageInInbox } from './journey/docketClerkViewsForwardedMessageInInbox';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerk1CreatesNoticeFromMessageDetail } from './journey/petitionsClerk1CreatesNoticeFromMessageDetail';
import { petitionsClerk1RepliesToMessage } from './journey/petitionsClerk1RepliesToMessage';
import { petitionsClerk1VerifiesCaseStatusOnMessage } from './journey/petitionsClerk1VerifiesCaseStatusOnMessage';
import { petitionsClerk1ViewsMessageDetail } from './journey/petitionsClerk1ViewsMessageDetail';
import { petitionsClerk1ViewsMessageInbox } from './journey/petitionsClerk1ViewsMessageInbox';
import { petitionsClerkCreatesNewMessageOnCaseWithMaxAttachments } from './journey/petitionsClerkCreatesNewMessageOnCaseWithMaxAttachments';
import { petitionsClerkCreatesNewMessageOnCaseWithNoAttachments } from './journey/petitionsClerkCreatesNewMessageOnCaseWithNoAttachments';
import { petitionsClerkCreatesOrderFromMessage } from './journey/petitionsClerkCreatesOrderFromMessage';
import { petitionsClerkForwardsMessageToDocketClerk } from './journey/petitionsClerkForwardsMessageToDocketClerk';
import { petitionsClerkForwardsMessageWithAttachment } from './journey/petitionsClerkForwardsMessageWithAttachment';
import { petitionsClerkVerifiesCompletedMessageNotInInbox } from './journey/petitionsClerkVerifiesCompletedMessageNotInInbox';
import { petitionsClerkVerifiesCompletedMessageNotInSection } from './journey/petitionsClerkVerifiesCompletedMessageNotInSection';
import { petitionsClerkViewsInProgressMessagesOnCaseDetail } from './journey/petitionsClerkViewsInProgressMessagesOnCaseDetail';
import { petitionsClerkViewsRepliesAndCompletesMessageInInbox } from './journey/petitionsClerkViewsRepliesAndCompletesMessageInInbox';
import { petitionsClerkViewsReplyInInbox } from './journey/petitionsClerkViewsReplyInInbox';
import { petitionsClerkViewsSentMessagesBox } from './journey/petitionsClerkViewsSentMessagesBox';
const { PETITIONS_SECTION, STATUS_TYPES } = applicationContext.getConstants();

describe('messages journey', () => {
  const cerebralTest = setupTest();

  beforeAll(() => {
    jest.spyOn(
      cerebralTest.applicationContext.getUseCases(),
      'createMessageInteractor',
    );
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case to send messages', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
    cerebralTest.documentId = caseDetail.docketEntries[0].docketEntryId;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewMessageOnCaseWithMaxAttachments(cerebralTest);
  createNewMessageOnCase(cerebralTest);
  petitionsClerkViewsSentMessagesBox(cerebralTest);
  petitionsClerk1VerifiesCaseStatusOnMessage(cerebralTest, STATUS_TYPES.new);

  loginAs(cerebralTest, 'docketclerk1@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk1@example.com');
  petitionsClerk1ViewsMessageInbox(cerebralTest);
  petitionsClerk1VerifiesCaseStatusOnMessage(
    cerebralTest,
    STATUS_TYPES.generalDocketReadyForTrial,
  );
  petitionsClerk1ViewsMessageDetail(cerebralTest);
  petitionsClerk1RepliesToMessage(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsReplyInInbox(cerebralTest);
  petitionsClerkCreatesOrderFromMessage(cerebralTest);
  petitionsClerkForwardsMessageToDocketClerk(cerebralTest);
  petitionsClerkViewsInProgressMessagesOnCaseDetail(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkViewsForwardedMessageInInbox(cerebralTest);
  docketClerkEditsOrderFromMessage(cerebralTest);
  docketClerkAppliesSignatureFromMessage(cerebralTest);
  docketClerkRemovesSignatureFromMessage(cerebralTest);
  docketClerkAppliesSignatureFromMessage(cerebralTest);
  docketClerkAddsDocketEntryFromMessage(cerebralTest);
  docketClerkCompletesMessageThread(cerebralTest);
  docketClerkViewsCompletedMessagesOnCaseDetail(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk1@example.com');
  petitionsClerkCreatesNewMessageOnCaseWithMaxAttachments(cerebralTest);
  createNewMessageOnCase(cerebralTest);
  petitionsClerk1ViewsMessageInbox(cerebralTest);
  petitionsClerk1ViewsMessageDetail(cerebralTest);
  petitionsClerk1CreatesNoticeFromMessageDetail(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk1@example.com');
  petitionsClerkCreatesNewMessageOnCaseWithNoAttachments(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk1@example.com');
  petitionsClerkForwardsMessageWithAttachment(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  createNewMessageOnCase(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk1@example.com');
  petitionsClerkViewsRepliesAndCompletesMessageInInbox(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkVerifiesCompletedMessageNotInInbox(cerebralTest);
  petitionsClerkVerifiesCompletedMessageNotInSection(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  it('attaches a document to a message with a very long title, which is truncated in the subject', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('openCreateMessageModalSequence');

    await cerebralTest.runSequence(
      'updateSectionInCreateMessageModalSequence',
      {
        key: 'toSection',
        value: PETITIONS_SECTION,
      },
    );

    await cerebralTest.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '4805d1ab-18d0-43ec-bafb-654e83405416', //petitionsclerk1
    });

    const currentDocketEntries = cerebralTest.getState(
      'caseDetail.docketEntries',
    );
    const longDocumentTitle = applicationContext
      .getUtilities()
      .getTextByCount(250);
    const docketEntryWithLongTitle = {
      addToCoversheet: false,
      createdAt: '2021-04-19T19:22:08.389Z',
      docketEntryId: '999cd272-da92-4e31-bedc-28cdad2e08b0',
      docketNumber: '304-21',
      documentTitle: longDocumentTitle,
      documentType: longDocumentTitle,
      entityName: 'DocketEntry',
      eventCode: 'STIN',
      filedBy: 'Petr. Mona Schultz',
      filingDate: '2021-04-19T19:22:08.385Z',
      index: 0,
      isDraft: false,
      isFileAttached: true,
      isMinuteEntry: false,
      isOnDocketRecord: false,
      isStricken: false,
      partyPrimary: true,
      partySecondary: false,
      pending: false,
      privatePractitioners: [],
      processingStatus: 'pending',
      receivedAt: '2021-04-19T04:00:00.000Z',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    };

    cerebralTest.setState('caseDetail.docketEntries', [
      ...currentDocketEntries,
      docketEntryWithLongTitle,
    ]);

    await cerebralTest.runSequence('updateMessageModalAttachmentsSequence', {
      action: 'add',
      documentId: docketEntryWithLongTitle.docketEntryId,
    });

    expect(cerebralTest.getState('modal.form.subject').length).toEqual(250);
    expect(cerebralTest.getState('modal.form.subject')).toEqual(
      longDocumentTitle.slice(0, 250),
    );

    await cerebralTest.runSequence('clearModalFormSequence');
  });

  it('attaches a document to a message and adds an attachment, but changes mind and removes it', async () => {
    const testMessageSubject = 'once more into the breach';
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('openCreateMessageModalSequence');

    await cerebralTest.runSequence(
      'updateSectionInCreateMessageModalSequence',
      {
        key: 'toSection',
        value: PETITIONS_SECTION,
      },
    );

    await cerebralTest.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '4805d1ab-18d0-43ec-bafb-654e83405416',
    });

    const currentDocketEntries = cerebralTest.getState(
      'caseDetail.docketEntries',
    );

    await cerebralTest.runSequence('updateMessageModalAttachmentsSequence', {
      action: 'add',
      documentId: currentDocketEntries[0].docketEntryId,
    });

    await cerebralTest.runSequence('updateMessageModalAttachmentsSequence', {
      action: 'remove',
      documentId: currentDocketEntries[0].docketEntryId,
    });

    await cerebralTest.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value: testMessageSubject,
    });

    await cerebralTest.runSequence('updateModalFormValueSequence', {
      key: 'subject',
      value: testMessageSubject,
    });

    await cerebralTest.runSequence('createMessageSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'outbox',
      queue: 'my',
    });

    const messages = cerebralTest.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === testMessageSubject,
    );

    expect(foundMessage).toBeDefined();
    expect(foundMessage.attachments).toEqual([]);
  });
});
