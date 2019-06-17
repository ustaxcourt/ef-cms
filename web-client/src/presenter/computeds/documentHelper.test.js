import { documentHelper } from './documentHelper';
import { runCompute } from 'cerebral/test';

const MY_INBOX = { box: 'inbox', queue: 'my' };
const MY_BATCHED = { box: 'batched', queue: 'my' };
const MY_OUTBOX = { box: 'outbox', queue: 'my' };
const SECTION_INBOX = { box: 'inbox', queue: 'section' };
const SECTION_BATCHED = { box: 'batched', queue: 'section' };
const SECTION_OUTBOX = { box: 'outbox', queue: 'section' };

describe('documentHelper', () => {
  it('should return a correctly-assembled URI to document details based on docket number and document id', async () => {
    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
    });
    expect(result).toEqual('/case-detail/abc/documents/123');
  });

  it('should return a correctly-assembled URI to document details based on docket number, document id, and messageId', async () => {
    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '123',
    });
    expect(result).toEqual('/case-detail/abc/documents/123/messages/123');
  });

  // Petition Clerk > Messages | My | Inbox > Message tab
  it('Petitions Clerk: Links from My Messages Inbox to individual Message tab', async () => {
    test.setState('user', { role: 'petitionsclerk' });
    test.setState('workQueueToDisplay', MY_INBOX);
    test.setState('workQueueIsInternal', true);

    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '456',
    });
    expect(result).toEqual('/case-detail/abc/documents/123/messages/456');
  });

  // Petition Clerk > Messages | My | Sent > Message tab
  it('Petitions Clerk: Links from My Messages Sent to individual Message tab', async () => {
    test.setState('user', { role: 'petitionsclerk' });
    test.setState('workQueueToDisplay', MY_OUTBOX);
    test.setState('workQueueIsInternal', true);

    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '456',
    });
    expect(result).toEqual('/case-detail/abc/documents/123/messages/456');
  });

  // Petition Clerk > Messages | Section | Inbox > Message tab
  it('Petitions Clerk: Links from Section Messages Inbox to individual Message tab', async () => {
    test.setState('user', { role: 'petitionsclerk' });
    test.setState('workQueueToDisplay', SECTION_INBOX);
    test.setState('workQueueIsInternal', true);

    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '456',
    });
    expect(result).toEqual('/case-detail/abc/documents/123/messages/456');
  });

  // Petition Clerk > Messages | Section | Sent > Message tab
  it('Petitions Clerk: Links from Section Messages Sent to individual Message tab', async () => {
    test.setState('user', { role: 'petitionsclerk' });
    test.setState('workQueueToDisplay', SECTION_OUTBOX);
    test.setState('workQueueIsInternal', true);

    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '456',
    });
    expect(result).toEqual('/case-detail/abc/documents/123/messages/456');
  });

  // Petition Clerk > Doc QC | My | Inbox > Doc Info tab (edit mode)
  it('Petitions Clerk: Links from My Document QC Inbox to Document Info tab', async () => {
    test.setState('user', { role: 'petitionsclerk' });
    test.setState('workQueueToDisplay', MY_INBOX);
    test.setState('workQueueIsInternal', false);

    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '456',
    });
    expect(result).toEqual('/case-detail/abc/documents/123');
  });

  // Petition Clerk > Doc QC | My | Batched > Doc Info tab (read only mode)
  it('Petitions Clerk: Links from My Document QC Batched to Document Info tab', async () => {
    test.setState('user', { role: 'petitionsclerk' });
    test.setState('workQueueToDisplay', MY_BATCHED);
    test.setState('workQueueIsInternal', false);

    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '456',
    });
    expect(result).toEqual('/case-detail/abc/documents/123');
  });

  // Petition Clerk > Doc QC | My | Served > Message tab (no doc info tab)
  it('Petitions Clerk: Links from My Document QC Served to individual Message Info tab', async () => {
    test.setState('user', { role: 'petitionsclerk' });
    test.setState('workQueueToDisplay', MY_OUTBOX);
    test.setState('workQueueIsInternal', false);

    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '456',
    });
    expect(result).toEqual('/case-detail/abc/documents/123/messages/456');
  });

  // Petition Clerk > Doc QC | Section | Inbox > Doc Info tab (edit mode)
  it('Petitions Clerk: Links from Section Document QC Inbox to Document Info tab', async () => {
    test.setState('user', { role: 'petitionsclerk' });
    test.setState('workQueueToDisplay', SECTION_INBOX);
    test.setState('workQueueIsInternal', false);

    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '456',
    });
    expect(result).toEqual('/case-detail/abc/documents/123');
  });

  // Petition Clerk > Doc QC | Section | Batched > Doc Info tab (read only mode)
  it('Petitions Clerk: Links from Section Document QC Batched to Document Info tab', async () => {
    test.setState('user', { role: 'petitionsclerk' });
    test.setState('workQueueToDisplay', SECTION_BATCHED);
    test.setState('workQueueIsInternal', false);

    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '456',
    });
    expect(result).toEqual('/case-detail/abc/documents/123');
  });

  // Petition Clerk > Doc QC | Section | Served > Message tab (no doc info tab)
  it('Petitions Clerk: Links from Section Document QC Served to individual Message Info tab', async () => {
    test.setState('user', { role: 'petitionsclerk' });
    test.setState('workQueueToDisplay', SECTION_OUTBOX);
    test.setState('workQueueIsInternal', false);

    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '456',
    });
    expect(result).toEqual('/case-detail/abc/documents/123/messages/456');
  });

  // Docket Clerk > Messages | My | Inbox > Message tab (no doc info tab)
  it('Docket Clerk: Links from My Messages Inbox to individual Message tab', async () => {
    test.setState('user', { role: 'docketclerk' });
    test.setState('workQueueToDisplay', MY_INBOX);
    test.setState('workQueueIsInternal', true);

    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '456',
    });
    expect(result).toEqual('/case-detail/abc/documents/123/messages/456');
  });

  // Docket Clerk > Messages | My | Sent > Message tab (no doc info tab)
  it('Docket Clerk: Links from My Messages Sent to individual Message tab', async () => {
    test.setState('user', { role: 'docketclerk' });
    test.setState('workQueueToDisplay', MY_OUTBOX);
    test.setState('workQueueIsInternal', true);

    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '456',
    });
    expect(result).toEqual('/case-detail/abc/documents/123/messages/456');
  });

  // Docket Clerk > Messages | Section | Inbox > Message tab (no doc info tab)
  it('Docket Clerk: Links from Section Messages Inbox to individual Message tab', async () => {
    test.setState('user', { role: 'docketclerk' });
    test.setState('workQueueToDisplay', SECTION_INBOX);
    test.setState('workQueueIsInternal', true);

    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '456',
    });
    expect(result).toEqual('/case-detail/abc/documents/123/messages/456');
  });

  // Docket Clerk > Messages | Section | Sent > Message tab (no doc info tab)
  it('Docket Clerk: Links from Section Messages Sent to individual Message tab', async () => {
    test.setState('user', { role: 'docketclerk' });
    test.setState('workQueueToDisplay', SECTION_OUTBOX);
    test.setState('workQueueIsInternal', true);

    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '456',
    });
    expect(result).toEqual('/case-detail/abc/documents/123/messages/456');
  });

  // Docket Clerk > Doc QC | My | Inbox > Message tab (no doc info tab)
  it('Docket Clerk: Links from MY Document QC Inbox to individual Message tab', async () => {
    test.setState('user', { role: 'docketclerk' });
    test.setState('workQueueToDisplay', MY_INBOX);
    test.setState('workQueueIsInternal', false);

    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '456',
    });
    expect(result).toEqual('/case-detail/abc/documents/123/messages/456');
  });

  // Docket Clerk > Doc QC | My | Processed > Message tab (no doc info tab)
  it('Docket Clerk: Links from MY Document QC Processed to individual Message tab', async () => {
    test.setState('user', { role: 'docketclerk' });
    test.setState('workQueueToDisplay', MY_OUTBOX);
    test.setState('workQueueIsInternal', false);

    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '456',
    });
    expect(result).toEqual('/case-detail/abc/documents/123/messages/456');
  });

  // Docket Clerk > Doc QC | Section | Inbox > Message tab (no doc info tab)
  it('Docket Clerk: Links from Section Document QC Inbox to individual Message tab', async () => {
    test.setState('user', { role: 'docketclerk' });
    test.setState('workQueueToDisplay', SECTION_INBOX);
    test.setState('workQueueIsInternal', false);

    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '456',
    });
    expect(result).toEqual('/case-detail/abc/documents/123/messages/456');
  });

  // Docket Clerk > Doc QC | Section | Processed > Message tab (no doc info tab) (edited)
  it('Docket Clerk: Links from Section Document QC Processed to individual Message tab', async () => {
    test.setState('user', { role: 'docketclerk' });
    test.setState('workQueueToDisplay', SECTION_OUTBOX);
    test.setState('workQueueIsInternal', false);

    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '456',
    });
    expect(result).toEqual('/case-detail/abc/documents/123/messages/456');
  });
});
