import { DOCUMENT_PROCESSING_STATUS_OPTIONS, ROLES } from './EntityConstants';
import { DocketEntry } from './DocketEntry';

describe('setAsProcessingStatusAsCompleted', () => {
  const mockPrimaryId = '7111b30b-ad38-42c8-9db0-d938cb2cb16b';
  const A_VALID_DOCKET_ENTRY = {
    createdAt: '2020-07-17T19:28:29.675Z',
    docketEntryId: '0f5e035c-efa8-49e4-ba69-daf8a166a98f',
    docketNumber: '101-21',
    documentType: 'Petition',
    eventCode: 'A',
    filedBy: 'Test Petitioner',
    filedByRole: ROLES.petitioner,
    filers: [mockPrimaryId],
    receivedAt: '2020-07-17T19:28:29.675Z',
    userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
  };

  it('sets the docket entry processing status as completed', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
      },
      {
        authorizedUser: undefined,
        petitioners: [
          {
            contactId: '7111b30b-ad38-42c8-9db0-d938cb2cb16b',
            contactType: 'primary',
          },
        ],
      },
    );

    expect(docketEntry.processingStatus).toEqual(
      DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
    );

    docketEntry.setAsProcessingStatusAsCompleted();

    expect(docketEntry.processingStatus).toEqual(
      DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    );
  });
});
