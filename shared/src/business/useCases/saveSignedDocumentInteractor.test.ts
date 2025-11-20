import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  PETITIONS_SECTION,
  SIGNED_DOCUMENT_TYPES,
} from '../entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import { applicationContext } from '../test/createTestApplicationContext';
import { getMessageThreadByParentId as getMessageThreadByParentIdMock } from '@web-api/persistence/postgres/messages/getMessageThreadByParentId';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { saveSignedDocumentInteractor } from './saveSignedDocumentInteractor';
import { upsertMessages as upsertMessagesMock } from '@web-api/persistence/postgres/messages/upsertMessages';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { Message } from '../entities/Message';

describe('saveSignedDocumentInteractor', () => {
  let mockCase;
  let mockDocketEntry;
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;

  const mockSigningName = 'Roslindis Angelino';
  const mockDocumentIdBeforeSignature = 'abc81f4d-1e47-423a-8caf-6d2fdc3d3857';
  const mockSignedDocumentStorageId = 'abc81f4d-1e47-423a-8caf-6d2fdc3d3858';
  const mockOriginalDocketEntryId = 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859';
  const mockParentMessageId = 'b3bc3773-6ddd-439d-a3c9-60d6beceff99';

  beforeAll(() => {
    mockDocketEntry = {
      ...MOCK_CASE.docketEntries[0],
      docketEntryId: mockOriginalDocketEntryId,
      documentStorageId: mockOriginalDocketEntryId,
    };
    mockCase = {
      ...MOCK_CASE,
      docketEntries: [...MOCK_CASE.docketEntries, mockDocketEntry],
      caseCaption: ',',
    };

    getCaseByDocketNumber.mockResolvedValue(mockCase);

    applicationContext.getUniqueId.mockReturnValue(
      mockDocumentIdBeforeSignature,
    );

    const getMessageThreadByParentId = jest.mocked(
      getMessageThreadByParentIdMock,
    );
    getMessageThreadByParentId.mockResolvedValue([
      {
        caseStatus: mockCase.status,
        caseTitle: 'Test Petitioner',
        createdAt: '2019-03-01T21:40:46.415Z',
        docketNumber: mockCase.docketNumber,
        docketNumberWithSuffix: mockCase.docketNumber,
        from: 'Test Petitionsclerk',
        fromSection: PETITIONS_SECTION,
        fromUserId: '4791e892-14ee-4ab1-8468-0c942ec379d2',
        message: 'hey there',
        messageId: 'a10d6855-f3ee-4c11-861c-c7f11cba4dff',
        parentMessageId: mockParentMessageId,
        subject: 'hello',
        to: 'Test Petitionsclerk2',
        toSection: PETITIONS_SECTION,
        toUserId: '449b916e-3362-4a5d-bf56-b2b94ba29c12',
      } as Message,
    ]);
  });

  it('should throw an error when an unknown user attempts to save a signed document', async () => {
    await expect(
      saveSignedDocumentInteractor(
        applicationContext,
        {
          docketNumber: mockCase.docketNumber,
          nameForSigning: mockSigningName,
          originalDocketEntryId: mockOriginalDocketEntryId,
          signedDocumentStorageId: mockSignedDocumentStorageId,
        } as any,
        undefined,
      ),
    ).rejects.toThrow(
      'User attempting to save signed document is not an auth user',
    );
  });

  it('should save the original, unsigned document to S3 with a new id', async () => {
    await saveSignedDocumentInteractor(
      applicationContext,
      {
        docketNumber: mockCase.docketNumber,
        nameForSigning: mockSigningName,
        originalDocketEntryId: mockOriginalDocketEntryId,
        signedDocumentStorageId: mockSignedDocumentStorageId,
      } as any,
      mockDocketClerkUser,
    );

    expect(applicationContext.getUniqueId).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({
      key: mockDocumentIdBeforeSignature,
    });
  });

  it('should replace the original, unsigned document with the signed document', async () => {
    await saveSignedDocumentInteractor(
      applicationContext,
      {
        docketNumber: mockCase.docketNumber,
        nameForSigning: mockSigningName,
        originalDocketEntryId: mockOriginalDocketEntryId,
        signedDocumentStorageId: mockSignedDocumentStorageId,
      } as any,
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[1][0],
    ).toMatchObject({
      key: mockDocketEntry.documentStorageId,
    });
  });

  it('should add the signed Stipulated Decision to the case given a Proposed Stipulated Decision', async () => {
    const { caseEntity } = await saveSignedDocumentInteractor(
      applicationContext,
      {
        docketNumber: mockCase.docketNumber,
        nameForSigning: mockSigningName,
        originalDocketEntryId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        signedDocumentStorageId: mockSignedDocumentStorageId,
      } as any,
      mockDocketClerkUser,
    );

    expect(caseEntity.docketEntries.length).toEqual(
      mockCase.docketEntries.length + 1,
    );
    const signedDocument = caseEntity.docketEntries.find(
      e =>
        e.documentType ===
        SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.documentType,
    );
    expect(signedDocument?.docketNumber).toEqual(caseEntity.docketNumber);

    const signedDocketEntry = caseEntity.docketEntries.find(
      doc =>
        doc.documentType === 'Stipulated Decision' &&
        doc.documentStorageId === mockSignedDocumentStorageId,
    );

    expect(signedDocketEntry?.isPaper).toEqual(false);
    expect(signedDocketEntry?.docketEntryId).toEqual(
      mockSignedDocumentStorageId,
    );
    expect(signedDocketEntry?.isDraft).toEqual(true);
    expect(signedDocketEntry?.signedJudgeName).toEqual(mockSigningName);
    expect(signedDocketEntry?.documentType).toEqual('Stipulated Decision');
  });

  it("should set the document's processing status to complete", async () => {
    const { caseEntity } = await saveSignedDocumentInteractor(
      applicationContext,
      {
        docketNumber: mockCase.docketNumber,
        nameForSigning: mockSigningName,
        originalDocketEntryId: mockOriginalDocketEntryId,
        signedDocumentStorageId: mockSignedDocumentStorageId,
      } as any,
      mockDocketClerkUser,
    );

    const signedDocument = caseEntity.docketEntries.find(
      doc => doc.docketEntryId === mockOriginalDocketEntryId,
    );
    expect(signedDocument?.processingStatus).toBe(
      DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    );
  });

  it('should set the documentIdBeforeSignature', async () => {
    const { caseEntity } = await saveSignedDocumentInteractor(
      applicationContext,
      {
        docketNumber: mockCase.docketNumber,
        nameForSigning: mockSigningName,
        originalDocketEntryId: mockOriginalDocketEntryId,
        signedDocumentStorageId: mockSignedDocumentStorageId,
      } as any,
      mockDocketClerkUser,
    );

    const signedDocument = caseEntity.docketEntries.find(
      doc => doc.docketEntryId === mockOriginalDocketEntryId,
    );
    expect(signedDocument?.documentIdBeforeSignature).toBe(
      mockDocumentIdBeforeSignature,
    );
  });

  it('should add the signed document to the latest message in the message thread if parentMessageId is included and the original document is a Proposed Stipulated Decision', async () => {
    const upsertMessages = upsertMessagesMock as jest.Mock;
    const originalDocketEntryId = 'def81f4d-1e47-423a-8caf-6d2fdc3d3859';
    await saveSignedDocumentInteractor(
      applicationContext,
      {
        docketNumber: mockCase.docketNumber,
        nameForSigning: mockSigningName,
        originalDocketEntryId,
        parentMessageId: mockParentMessageId,
        signedDocumentStorageId: mockSignedDocumentStorageId,
      },
      mockDocketClerkUser,
    );

    expect(upsertMessages).toHaveBeenCalled();
    expect(upsertMessages.mock.calls[0][0]).toMatchObject([
      {
        attachments: [
          {
            documentId: mockSignedDocumentStorageId,
            documentTitle: 'Stipulated Decision',
          },
        ],
      },
    ]);
  });
});
