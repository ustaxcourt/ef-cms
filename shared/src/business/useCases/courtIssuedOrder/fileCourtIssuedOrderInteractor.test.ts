import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PETITIONS_SECTION,
  ROLES,
} from '../../entities/EntityConstants';
import { MOCK_LOCK } from '../../../test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { User } from '../../entities/User';
import { applicationContext } from '../../test/createTestApplicationContext';
import { fileCourtIssuedOrderInteractor } from './fileCourtIssuedOrderInteractor';

describe('fileCourtIssuedOrderInteractor', () => {
  const mockUserId = applicationContext.getUniqueId();
  const caseRecord = {
    caseCaption: 'Caption',
    caseType: CASE_TYPES_MAP.whistleblower,
    createdAt: '',
    docketEntries: [
      {
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: '45678-18',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        filedByRole: ROLES.petitioner,
        userId: mockUserId,
      },
      {
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: '45678-18',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        filedByRole: ROLES.petitioner,
        userId: mockUserId,
      },
      {
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: '45678-18',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        filedByRole: ROLES.petitioner,
        userId: mockUserId,
      },
    ],
    docketNumber: '45678-18',
    docketNumberWithSuffix: '45678-18W',
    filingType: 'Myself',
    partyType: PARTY_TYPES.petitioner,
    petitioners: [
      {
        address1: '123 Main St',
        city: 'Somewhere',
        contactType: CONTACT_TYPES.primary,
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'fieri@example.com',
        name: 'Guy Fieri',
        phone: '1234567890',
        postalCode: '12345',
        state: 'CA',
      },
    ],
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Regular',
    role: ROLES.petitioner,
    status: CASE_STATUS_TYPES.new,
    userId: 'ddd6c900-388b-4151-8014-b3378076bfb0',
  };
  let mockLock;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
        role: ROLES.petitionsClerk,
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    );

    applicationContext.getPersistenceGateway().getUserById.mockReturnValue(
      new User({
        name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
        role: ROLES.petitionsClerk,
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    );

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseRecord);
  });

  it('should throw an error if not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      fileCourtIssuedOrderInteractor(applicationContext, {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentType: 'Order to Show Cause',
          eventCode: 'OSC',
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should add order document to case', async () => {
    await fileCourtIssuedOrderInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentType: 'Order to Show Cause',
        eventCode: 'OSC',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries.length,
    ).toEqual(4);
  });

  it('should add order document to case and set freeText and draftOrderState.freeText to the document title if it is a generic order (eventCode O)', async () => {
    await fileCourtIssuedOrderInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Order to do anything',
        documentType: 'Order',
        draftOrderState: {},
        eventCode: 'O',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries.length,
    ).toEqual(4);
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries[3],
    ).toMatchObject({
      draftOrderState: { freeText: 'Order to do anything' },
      freeText: 'Order to do anything',
    });
  });

  it('should delete draftOrderState properties if they exists on the documentMetadata, after saving the document', async () => {
    await fileCourtIssuedOrderInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentContents: {},
        documentTitle: 'Order to do anything',
        documentType: 'Order',
        draftOrderState: {
          documentContents: 'something',
          editorDelta: 'something',
          richText: 'something',
        },
        eventCode: 'O',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries[3].draftOrderState.documentContents,
    ).toBeUndefined();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries[3].draftOrderState.editorDelta,
    ).toBeUndefined();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries[3].draftOrderState.richText,
    ).toBeUndefined();
  });

  it('should add a generic notice document to case, set freeText to the document title, and set the document to signed', async () => {
    await fileCourtIssuedOrderInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Notice to be nice',
        documentType: 'Notice',
        eventCode: 'NOT',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries.length,
    ).toEqual(4);
    const result =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries[3];
    expect(result).toMatchObject({ freeText: 'Notice to be nice' });
    expect(result.signedAt).toBeTruthy();
  });

  it('should store documentMetadata.documentContents in S3 and delete from data sent to persistence', async () => {
    await fileCourtIssuedOrderInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentContents: 'I am some document contents',
        documentType: 'Order to Show Cause',
        eventCode: 'OSC',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({
      useTempBucket: false,
    });
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries[3].documentContents,
    ).toBeUndefined();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries[3],
    ).toMatchObject({
      documentContentsId: expect.anything(),
      draftOrderState: {},
    });
  });

  it('should append docket number with suffix and case caption to document contents before storing', async () => {
    await fileCourtIssuedOrderInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentContents: 'I am some document contents',
        documentType: 'Order to Show Cause',
        eventCode: 'OSC',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    const savedDocumentContents = JSON.parse(
      applicationContext
        .getPersistenceGateway()
        .saveDocumentFromLambda.mock.calls[0][0].document.toString(),
    ).documentContents;

    expect(savedDocumentContents).toContain(caseRecord.docketNumberWithSuffix);
    expect(savedDocumentContents).toContain(caseRecord.caseCaption);
  });

  it('should set documentMetadata documentContents if parseAndScrapePdfContents returns content', async () => {
    const mockDocumentContents = 'bloop ee doop brnabowbow';
    applicationContext
      .getUseCaseHelpers()
      .parseAndScrapePdfContents.mockReturnValue(mockDocumentContents);

    await fileCourtIssuedOrderInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentType: 'Order to Show Cause',
        eventCode: 'OSC',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    const savedDocumentContents = JSON.parse(
      applicationContext
        .getPersistenceGateway()
        .saveDocumentFromLambda.mock.calls[0][0].document.toString(),
    ).documentContents;

    expect(savedDocumentContents).toContain(mockDocumentContents);
  });

  it('should parse and scrape pdf contents', async () => {
    await fileCourtIssuedOrderInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'TC Opinion',
        documentType: 'T.C. Opinion',
        eventCode: 'TCOP',
        judge: 'Dredd',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getUseCaseHelpers().parseAndScrapePdfContents,
    ).toHaveBeenCalled();
  });

  it('should add order document to most recent message if a parentMessageId is passed in', async () => {
    applicationContext
      .getPersistenceGateway()
      .getMessageThreadByParentId.mockReturnValue([
        {
          caseStatus: caseRecord.status,
          caseTitle: PARTY_TYPES.petitioner,
          createdAt: '2019-03-01T21:40:46.415Z',
          docketNumber: caseRecord.docketNumber,
          docketNumberWithSuffix: caseRecord.docketNumber,
          from: 'Test Petitionsclerk',
          fromSection: PETITIONS_SECTION,
          fromUserId: '4791e892-14ee-4ab1-8468-0c942ec379d2',
          message: 'hey there',
          messageId: 'a10d6855-f3ee-4c11-861c-c7f11cba4dff',
          parentMessageId: '31687a1e-3640-42cd-8e7e-a8e6df39ce9a',
          subject: 'hello',
          to: 'Test Petitionsclerk2',
          toSection: PETITIONS_SECTION,
          toUserId: '449b916e-3362-4a5d-bf56-b2b94ba29c12',
        },
      ]);

    await fileCourtIssuedOrderInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Order to do anything',
        documentType: 'Order',
        eventCode: 'O',
        parentMessageId: '6c1fd626-c1e1-4367-bca6-e00f9ef98cf5',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().upsertMessage,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().upsertMessage.mock.calls[0][0]
        .message.attachments,
    ).toEqual([
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentTitle: 'Order to do anything',
      },
    ]);
  });

  it('should set isDraft to true when creating a court issued document', async () => {
    applicationContext
      .getPersistenceGateway()
      .getMessageThreadByParentId.mockReturnValue([
        {
          caseStatus: caseRecord.status,
          caseTitle: PARTY_TYPES.petitioner,
          createdAt: '2019-03-01T21:40:46.415Z',
          docketNumber: caseRecord.docketNumber,
          docketNumberWithSuffix: caseRecord.docketNumber,
          from: 'Test Petitionsclerk',
          fromSection: PETITIONS_SECTION,
          fromUserId: '4791e892-14ee-4ab1-8468-0c942ec379d2',
          message: 'hey there',
          messageId: 'a10d6855-f3ee-4c11-861c-c7f11cba4dff',
          parentMessageId: '31687a1e-3640-42cd-8e7e-a8e6df39ce9a',
          subject: 'hello',
          to: 'Test Petitionsclerk2',
          toSection: PETITIONS_SECTION,
          toUserId: '449b916e-3362-4a5d-bf56-b2b94ba29c12',
        },
      ]);

    await fileCourtIssuedOrderInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Order to do anything',
        documentType: 'Order',
        eventCode: 'O',
        parentMessageId: '6c1fd626-c1e1-4367-bca6-e00f9ef98cf5',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    const lastDocumentIndex =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries.length - 1;

    const newlyFiledDocument =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries[lastDocumentIndex];

    expect(newlyFiledDocument).toMatchObject({
      isDraft: true,
    });
  });

  it('should throw an error if fails to parse pdf', async () => {
    applicationContext
      .getUseCaseHelpers()
      .parseAndScrapePdfContents.mockImplementation(() => {
        throw new Error('error parsing pdf');
      });

    await expect(
      fileCourtIssuedOrderInteractor(applicationContext, {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'TC Opinion',
          documentType: 'T.C. Opinion',
          eventCode: 'TCOP',
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('error parsing pdf');
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      fileCourtIssuedOrderInteractor(applicationContext, {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentContents: 'I am some document contents',
          documentType: 'Order to Show Cause',
          eventCode: 'OSC',
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await fileCourtIssuedOrderInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentContents: 'I am some document contents',
        documentType: 'Order to Show Cause',
        eventCode: 'OSC',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${caseRecord.docketNumber}`,
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${caseRecord.docketNumber}`],
    });
  });
});
