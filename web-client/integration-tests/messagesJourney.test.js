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

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewMessageOnCaseWithMaxAttachments(test);
  createNewMessageOnCase(test);
  petitionsClerkViewsSentMessagesBox(test);
  petitionsClerk1VerifiesCaseStatusOnMessage(test, STATUS_TYPES.new);

  loginAs(test, 'docketclerk1@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(test);

  loginAs(test, 'petitionsclerk1@example.com');
  petitionsClerk1ViewsMessageInbox(test);
  petitionsClerk1VerifiesCaseStatusOnMessage(
    test,
    STATUS_TYPES.generalDocketReadyForTrial,
  );
  petitionsClerk1ViewsMessageDetail(test);
  petitionsClerk1RepliesToMessage(test);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsReplyInInbox(test);
  petitionsClerkCreatesOrderFromMessage(test);
  petitionsClerkForwardsMessageToDocketClerk(test);
  petitionsClerkViewsInProgressMessagesOnCaseDetail(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkViewsForwardedMessageInInbox(test);
  docketClerkEditsOrderFromMessage(test);
  docketClerkAppliesSignatureFromMessage(test);
  docketClerkRemovesSignatureFromMessage(test);
  docketClerkAppliesSignatureFromMessage(test);
  docketClerkAddsDocketEntryFromMessage(test);
  docketClerkCompletesMessageThread(test);
  docketClerkViewsCompletedMessagesOnCaseDetail(test);

  loginAs(test, 'petitionsclerk1@example.com');
  petitionsClerkCreatesNewMessageOnCaseWithMaxAttachments(test);
  createNewMessageOnCase(test);
  petitionsClerk1ViewsMessageInbox(test);
  petitionsClerk1ViewsMessageDetail(test);
  petitionsClerk1CreatesNoticeFromMessageDetail(test);

  loginAs(test, 'petitionsclerk1@example.com');
  petitionsClerkCreatesNewMessageOnCaseWithNoAttachments(test);

  loginAs(test, 'petitionsclerk1@example.com');
  petitionsClerkForwardsMessageWithAttachment(test);

  loginAs(test, 'petitionsclerk@example.com');
  createNewMessageOnCase(test);

  loginAs(test, 'petitionsclerk1@example.com');
  petitionsClerkViewsRepliesAndCompletesMessageInInbox(test);

  loginAs(test, 'petitionsclerk@example.com');
  it('wait for ES index', async () => {
    await refreshElasticsearchIndex();
  });
  petitionsClerkVerifiesCompletedMessageNotInInbox(test);
  petitionsClerkVerifiesCompletedMessageNotInSection(test);
});
