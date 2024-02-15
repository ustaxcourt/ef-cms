import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_DOCUMENTS } from '../../../test/mockDocketEntry';
import { MOCK_LOCK } from '../../../test/mockLock';
import {
  MOTION_DISPOSITIONS,
  ORDER_TYPES,
  PETITIONS_SECTION,
} from '../../entities/EntityConstants';
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import { addDraftStampOrderDocketEntryInteractor } from './addDraftStampOrderDocketEntryInteractor';
import { applicationContext } from '../../test/createTestApplicationContext';
import { clerkOfCourtUser, judgeUser } from '../../../test/mockUsers';

describe('addDraftStampOrderDocketEntryInteractor', () => {
  let mockLock;
  const mockSigningName = 'Guy Fieri';
  const mockStampedDocketEntryId = 'abc81f4d-1e47-423a-8caf-6d2fdc3d3858';
  const mockOriginalDocketEntryId = 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859';
  const mockParentMessageId = 'b3bc3773-6ddd-439d-a3c9-60d6beceff99';
  const args = {
    docketNumber: MOCK_CASE.docketNumber,
    formattedDraftDocumentTitle: 'some title with disposition and custom text',
    originalDocketEntryId: mockOriginalDocketEntryId,
    stampData: {
      disposition: MOTION_DISPOSITIONS.GRANTED,
      nameForSigning: mockSigningName,
    },
    stampedDocketEntryId: mockStampedDocketEntryId,
  };

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;
    applicationContext.getCurrentUser.mockReturnValue(clerkOfCourtUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    applicationContext.getCurrentUser.mockReturnValue(judgeUser);
  });

  it('should add a draft order docket entry to the case', async () => {
    await addDraftStampOrderDocketEntryInteractor(applicationContext, args);

    const { caseToUpdate } =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0];

    expect(caseToUpdate.docketEntries.length).toEqual(
      MOCK_DOCUMENTS.length + 1,
    );

    const motionDocumentType = MOCK_CASE.docketEntries.find(
      e => e.docketEntryId === mockOriginalDocketEntryId,
    ).documentType;

    const draftDocketEntryEntity = caseToUpdate.docketEntries.find(
      doc =>
        doc.documentType === ORDER_TYPES[0].documentType &&
        doc.docketEntryId === mockStampedDocketEntryId,
    );

    expect(draftDocketEntryEntity).toMatchObject({
      docketEntryId: mockStampedDocketEntryId,
      docketNumber: caseToUpdate.docketNumber,
      documentType: ORDER_TYPES[0].documentType,
      filedBy: judgeUser.judgeFullName,
      freeText: `${motionDocumentType} some title with disposition and custom text`,
      isDraft: true,
      signedJudgeName: mockSigningName,
    });
  });

  it("should set the filedBy to the current user's name if there is no judge full name on the user", async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      ...judgeUser,
      judgeFullName: undefined,
    });

    await addDraftStampOrderDocketEntryInteractor(applicationContext, args);

    const { caseToUpdate } =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0];

    const draftDocketEntryEntity = caseToUpdate.docketEntries.find(
      doc =>
        doc.documentType === ORDER_TYPES[0].documentType &&
        doc.docketEntryId === mockStampedDocketEntryId,
    );

    expect(draftDocketEntryEntity).toMatchObject({
      filedBy: judgeUser.name,
    });
  });

  it('should add the stamped document to the latest message if parentMessageId is included', async () => {
    const mockMessage = {
      caseStatus: MOCK_CASE.status,
      caseTitle: 'Test Petitioner',
      createdAt: '2019-03-01T21:40:46.415Z',
      docketNumber: MOCK_CASE.docketNumber,
      docketNumberWithSuffix: MOCK_CASE.docketNumber,
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
    };

    applicationContext
      .getPersistenceGateway()
      .getMessageThreadByParentId.mockReturnValue([mockMessage]);

    await addDraftStampOrderDocketEntryInteractor(applicationContext, {
      ...args,
      parentMessageId: mockParentMessageId,
    });

    expect(
      applicationContext.getPersistenceGateway().upsertMessage,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().upsertMessage.mock.calls[0][0]
        .message,
    ).toMatchObject({
      attachments: [
        {
          documentId: mockStampedDocketEntryId,
        },
      ],
    });
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      addDraftStampOrderDocketEntryInteractor(applicationContext, args),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await addDraftStampOrderDocketEntryInteractor(applicationContext, args);

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
    });
  });

  it('should throw an Unauthorized error if the user is not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      addDraftStampOrderDocketEntryInteractor(applicationContext, args),
    ).rejects.toThrow(UnauthorizedError);
  });
});
