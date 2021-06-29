import {
  CASE_STATUS_TYPES,
  PETITIONS_SECTION,
} from '../../../../shared/src/business/entities/EntityConstants';
import { CerebralTest } from 'cerebral/test';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoMessageDetailSequence } from '../sequences/gotoMessageDetailSequence';
import { presenter } from '../presenter-mock';

describe('gotoMessageDetailSequence', () => {
  const mockDocketNumber = '101-21';
  const mockDocumentId = 'eb610c66-34a2-46ef-94cc-8ba00f071e7d';
  const mockParentMessageId = '7c6211ff-11cf-41ce-a25c-6cedd10420c3';
  const mockPdfUrl = 'www.example.com';

  const mockDocketEntry = {
    createdAt: '2019-04-19T17:29:13.120Z',
    docketEntryId: mockDocumentId,
    documentTitle: 'Partial Administrative Record',
    documentType: 'Partial Administrative Record',
    eventCode: 'PARD',
    filingDate: '2019-04-19T17:29:13.120Z',
    isFileAttached: true,
    isOnDocketRecord: true,
    partyPrimary: true,
    scenario: 'Standard',
    servedAt: '2019-06-19T17:29:13.120Z',
  };

  const mockMessage = {
    attachments: [{ ...mockDocketEntry, documentId: mockDocumentId }],
    caseStatus: CASE_STATUS_TYPES.generalDocket,
    caseTitle: 'Bill Burr',
    createdAt: '2019-03-01T21:40:46.415Z',
    docketNumber: '123-45',
    docketNumberWithSuffix: '123-45S',
    entityName: 'Message',
    from: 'Test Petitionsclerk2',
    fromSection: PETITIONS_SECTION,
    fromUserId: 'fe6eeadd-e4e8-4e56-9ddf-0ebe9516df6b',
    isRepliedTo: false,
    message: "How's it going?",
    messageId: '9ca37b65-9aac-4621-b5d7-e4a7c8a26a21',
    parentMessageId: '9ca37b65-9aac-4621-b5d7-e4a7c8a26a21',
    subject: 'Hey!',
    to: 'Test Petitionsclerk',
    toSection: PETITIONS_SECTION,
    toUserId: 'b427ca37-0df1-48ac-94bb-47aed073d6f7',
  };

  let test;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      gotoMessageDetailSequence,
    };
    test = CerebralTest(presenter);

    applicationContext.getUseCases().getCaseInteractor.mockReturnValue({
      ...MOCK_CASE,
      archivedCorrespondences: [],
      docketEntries: [mockDocketEntry],
      docketNumber: mockDocketNumber,
    });

    applicationContext
      .getUseCases()
      .getMessageThreadInteractor.mockReturnValue([mockMessage]);

    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockReturnValue({ url: mockPdfUrl });
  });

  it('should change the page to MyAccount and close the opened menu', async () => {
    await test.runSequence('gotoMessageDetailSequence', {
      docketNumber: mockDocketNumber,
      documentId: mockDocumentId,
      parentMessageId: mockParentMessageId,
    });

    expect(test.getState()).toMatchObject({
      iframeSrc: mockPdfUrl,
      messageDetail: [mockMessage],
      messageViewerDocumentToDisplay: {
        documentId: mockDocumentId,
      },
      parentMessageId: mockParentMessageId,
    });
  });
});
