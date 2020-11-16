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
import { loginAs, setupTest, uploadPetition } from './helpers';
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
import { petitionsClerkViewsInProgressMessagesOnCaseDetail } from './journey/petitionsClerkViewsInProgressMessagesOnCaseDetail';
import { petitionsClerkViewsReplyInInbox } from './journey/petitionsClerkViewsReplyInInbox';
import { petitionsClerkViewsSentMessagesBox } from './journey/petitionsClerkViewsSentMessagesBox';

const theTest = setupTest();
const { STATUS_TYPES } = applicationContext.getConstants();

describe('messages journey', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  loginAs(theTest, 'petitioner@example.com');
  it('Create test case to send messages', async () => {
    const caseDetail = await uploadPetition(theTest);
    expect(caseDetail.docketNumber).toBeDefined();
    theTest.docketNumber = caseDetail.docketNumber;
    theTest.documentId = caseDetail.docketEntries[0].docketEntryId;
  });

  loginAs(theTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewMessageOnCaseWithMaxAttachments(theTest);
  createNewMessageOnCase(theTest);
  petitionsClerkViewsSentMessagesBox(theTest);
  petitionsClerk1VerifiesCaseStatusOnMessage(theTest, STATUS_TYPES.new);

  loginAs(theTest, 'docketclerk1@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(theTest);

  loginAs(theTest, 'petitionsclerk1@example.com');
  petitionsClerk1ViewsMessageInbox(theTest);
  petitionsClerk1VerifiesCaseStatusOnMessage(
    theTest,
    STATUS_TYPES.generalDocketReadyForTrial,
  );
  petitionsClerk1ViewsMessageDetail(theTest);
  petitionsClerk1RepliesToMessage(theTest);

  loginAs(theTest, 'petitionsclerk@example.com');
  petitionsClerkViewsReplyInInbox(theTest);
  petitionsClerkCreatesOrderFromMessage(theTest);
  petitionsClerkForwardsMessageToDocketClerk(theTest);
  petitionsClerkViewsInProgressMessagesOnCaseDetail(theTest);

  loginAs(theTest, 'docketclerk@example.com');
  docketClerkViewsForwardedMessageInInbox(theTest);
  docketClerkEditsOrderFromMessage(theTest);
  docketClerkAppliesSignatureFromMessage(theTest);
  docketClerkRemovesSignatureFromMessage(theTest);
  docketClerkAppliesSignatureFromMessage(theTest);
  docketClerkAddsDocketEntryFromMessage(theTest);
  docketClerkCompletesMessageThread(theTest);
  docketClerkViewsCompletedMessagesOnCaseDetail(theTest);

  loginAs(theTest, 'petitionsclerk1@example.com');
  petitionsClerkCreatesNewMessageOnCaseWithMaxAttachments(theTest);
  createNewMessageOnCase(theTest);
  petitionsClerk1ViewsMessageInbox(theTest);
  petitionsClerk1ViewsMessageDetail(theTest);
  petitionsClerk1CreatesNoticeFromMessageDetail(theTest);

  loginAs(theTest, 'petitionsclerk1@example.com');
  petitionsClerkCreatesNewMessageOnCaseWithNoAttachments(theTest);

  loginAs(theTest, 'petitionsclerk1@example.com');
  petitionsClerkForwardsMessageWithAttachment(theTest);
});
