import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PETITIONS_SECTION,
  ROLES,
  STATUS_REPORT_ORDER_OPTIONS,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_LOCK } from '../../../../../shared/src/test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { User } from '../../../../../shared/src/business/entities/User';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { fileCourtIssuedOrderInteractor } from './fileCourtIssuedOrderInteractor';
import { getMessageThreadByParentId } from '@web-api/persistence/postgres/messages/getMessageThreadByParentId';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { updateMessage } from '@web-api/persistence/postgres/messages/updateMessage';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCase as updateCaseMock } from '@web-api/persistence/postgres/cases/updateCase';

const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
const updateCase = jest.mocked(updateCaseMock);

/* eslint-disable max-lines */
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
        name: 'Roslindis Angelino',
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

    applicationContext.getPersistenceGateway().getUserById.mockReturnValue(
      new User({
        name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
        role: ROLES.petitionsClerk,
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    );

    getCaseByDocketNumber.mockReturnValue(caseRecord);
  });

  it('should throw an error if not authorized', async () => {
    await expect(
      fileCourtIssuedOrderInteractor(
        applicationContext,
        {
          documentMetadata: {
            docketNumber: caseRecord.docketNumber,
            documentType: 'Order to Show Cause',
            eventCode: 'OSC',
          },
          primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should add order document to case', async () => {
    await fileCourtIssuedOrderInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentType: 'Order to Show Cause',
          eventCode: 'OSC',
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      mockDocketClerkUser,
    );

    expect(getCaseByDocketNumber).toHaveBeenCalled();
    expect(
      updateCase.mock.calls[0][0].caseToUpdate.docketEntries.length,
    ).toEqual(4);
  });

  it('should delete draftOrderState properties if they exists on the documentMetadata, after saving the document', async () => {
    await fileCourtIssuedOrderInteractor(
      applicationContext,
      {
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
      },
      mockDocketClerkUser,
    );

    expect(
      updateCase.mock.calls[0][0].caseToUpdate.docketEntries[3].draftOrderState
        .documentContents,
    ).toBeUndefined();
    expect(
      updateCase.mock.calls[0][0].caseToUpdate.docketEntries[3].draftOrderState
        .editorDelta,
    ).toBeUndefined();
    expect(
      updateCase.mock.calls[0][0].caseToUpdate.docketEntries[3].draftOrderState
        .richText,
    ).toBeUndefined();
  });

  it('should add a generic notice document to case, set freeText to the document title, and set the document to signed', async () => {
    await fileCourtIssuedOrderInteractor(
      applicationContext,
      {
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
      },
      mockDocketClerkUser,
    );

    expect(updateCase).toHaveBeenCalled();
    expect(
      updateCase.mock.calls[0][0].caseToUpdate.docketEntries.length,
    ).toEqual(4);
    const result = updateCase.mock.calls[0][0].caseToUpdate.docketEntries[3];
    expect(result).toMatchObject({ freeText: 'Notice to be nice' });
    expect(result.signedAt).toBeTruthy();
  });

  it('should store documentMetadata.documentContents in S3 and delete from data sent to persistence', async () => {
    await fileCourtIssuedOrderInteractor(
      applicationContext,
      {
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
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({
      useTempBucket: false,
    });
    expect(
      updateCase.mock.calls[0][0].caseToUpdate.docketEntries[3]
        .documentContents,
    ).toBeUndefined();
    expect(
      updateCase.mock.calls[0][0].caseToUpdate.docketEntries[3],
    ).toMatchObject({
      documentContentsId: expect.anything(),
      draftOrderState: {},
    });
  });

  it('should append docket number with suffix and case caption to document contents before storing', async () => {
    await fileCourtIssuedOrderInteractor(
      applicationContext,
      {
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
      },
      mockDocketClerkUser,
    );

    const savedDocumentContents = JSON.parse(
      applicationContext
        .getPersistenceGateway()
        .saveDocumentFromLambda.mock.calls[0][0].document.toString(),
    ).documentContents;

    expect(savedDocumentContents).toContain(caseRecord.docketNumberWithSuffix);
    expect(savedDocumentContents).toContain(caseRecord.caseCaption);
  });

  it('should append the docket number and case caption to the document contents if document contents was defined', async () => {
    await fileCourtIssuedOrderInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentContents: 'hello',
          documentType: 'Order to Show Cause',
          eventCode: 'OSC',
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      mockDocketClerkUser,
    );

    const savedDocumentContents = JSON.parse(
      applicationContext
        .getPersistenceGateway()
        .saveDocumentFromLambda.mock.calls[0][0].document.toString(),
    ).documentContents;

    expect(savedDocumentContents).toEqual('hello 45678-18W Caption');
  });

  it('should add order document to most recent message if a parentMessageId is passed in', async () => {
    (getMessageThreadByParentId as jest.Mock).mockReturnValue([
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

    await fileCourtIssuedOrderInteractor(
      applicationContext,
      {
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
      },
      mockDocketClerkUser,
    );

    expect(updateMessage).toHaveBeenCalled();
    expect(
      (updateMessage as jest.Mock).mock.calls[0][0].message.attachments,
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

    await fileCourtIssuedOrderInteractor(
      applicationContext,
      {
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
      },
      mockDocketClerkUser,
    );

    const lastDocumentIndex =
      updateCase.mock.calls[0][0].caseToUpdate.docketEntries.length - 1;

    const newlyFiledDocument =
      updateCase.mock.calls[0][0].caseToUpdate.docketEntries[lastDocumentIndex];

    expect(newlyFiledDocument).toMatchObject({
      isDraft: true,
    });
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      fileCourtIssuedOrderInteractor(
        applicationContext,
        {
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
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await fileCourtIssuedOrderInteractor(
      applicationContext,
      {
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
      },
      mockDocketClerkUser,
    );

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

  describe('freeText', () => {
    describe('eventCode "NOT"', () => {
      it('should add order document to case and set freeText and draftOrderState.freeText to the document title if it eventCode NOT', async () => {
        await fileCourtIssuedOrderInteractor(
          applicationContext,
          {
            documentMetadata: {
              docketNumber: caseRecord.docketNumber,
              documentTitle: 'Order to do anything',
              documentType: 'Order',
              draftOrderState: {},
              eventCode: 'NOT',
              signedAt: '2019-03-01T21:40:46.415Z',
              signedByUserId: mockUserId,
              signedJudgeName: 'Dredd',
            },
            primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          },
          mockDocketClerkUser,
        );

        expect(getCaseByDocketNumber).toHaveBeenCalled();
        expect(
          updateCase.mock.calls[0][0].caseToUpdate.docketEntries.length,
        ).toEqual(4);
        expect(
          updateCase.mock.calls[0][0].caseToUpdate.docketEntries[3],
        ).toMatchObject({
          draftOrderState: { freeText: 'Order to do anything' },
          freeText: 'Order to do anything',
        });
      });
    });

    describe('eventCode "O"', () => {
      it('should add order document to case and set freeText and draftOrderState.freeText correctly for orderType status report', async () => {
        await fileCourtIssuedOrderInteractor(
          applicationContext,
          {
            documentMetadata: {
              draftOrderState: {},
              dueDate: '2024-11-05',
              eventCode: 'O',
              orderType:
                STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.statusReport,
              strickenFromTrialSessions: false,
            },
            primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          },
          mockDocketClerkUser,
        );

        expect(getCaseByDocketNumber).toHaveBeenCalled();
        expect(
          updateCase.mock.calls[0][0].caseToUpdate.docketEntries[3],
        ).toMatchObject({
          draftOrderState: {
            freeText: 'Order parties by 11/05/2024 shall file a status report.',
          },
          freeText: 'Order parties by 11/05/2024 shall file a status report.',
        });
      });

      it('should add order document to case and set freeText and draftOrderState.freeText correctly for orderType status report and when case is stricken from current trial session', async () => {
        await fileCourtIssuedOrderInteractor(
          applicationContext,
          {
            documentMetadata: {
              draftOrderState: {},
              dueDate: '2024-11-05',
              eventCode: 'O',
              orderType:
                STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.statusReport,
              strickenFromTrialSessions: true,
            },
            primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          },
          mockDocketClerkUser,
        );

        expect(getCaseByDocketNumber).toHaveBeenCalled();
        expect(
          updateCase.mock.calls[0][0].caseToUpdate.docketEntries[3],
        ).toMatchObject({
          draftOrderState: {
            freeText:
              'Order parties by 11/05/2024 shall file a status report. Case is stricken from the current trial session.',
          },
          freeText:
            'Order parties by 11/05/2024 shall file a status report. Case is stricken from the current trial session.',
        });
      });

      it('should add order document to case and set freeText and draftOrderState.freeText correctly for orderType status report and when case is stricken from current trial session and jurisdiction is restored to general docket', async () => {
        await fileCourtIssuedOrderInteractor(
          applicationContext,
          {
            documentMetadata: {
              draftOrderState: {},
              dueDate: '2024-11-05',
              eventCode: 'O',
              jurisdiction:
                STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.restored,
              orderType:
                STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.statusReport,
              strickenFromTrialSessions: true,
            },
            primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          },
          mockDocketClerkUser,
        );

        expect(getCaseByDocketNumber).toHaveBeenCalled();
        expect(
          updateCase.mock.calls[0][0].caseToUpdate.docketEntries[3],
        ).toMatchObject({
          draftOrderState: {
            freeText:
              'Order parties by 11/05/2024 shall file a status report. Case is stricken from the current trial session. Case is no longer jurisdiction retained and is restored to the general docket.',
          },
          freeText:
            'Order parties by 11/05/2024 shall file a status report. Case is stricken from the current trial session. Case is no longer jurisdiction retained and is restored to the general docket.',
        });
      });

      it('should add order document to case and set freeText and draftOrderState.freeText correctly for orderType status report stipulated decision', async () => {
        await fileCourtIssuedOrderInteractor(
          applicationContext,
          {
            documentMetadata: {
              draftOrderState: {},
              dueDate: '2024-11-05',
              eventCode: 'O',
              orderType:
                STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.stipulatedDecision,
              strickenFromTrialSessions: false,
            },
            primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          },
          mockDocketClerkUser,
        );

        expect(getCaseByDocketNumber).toHaveBeenCalled();
        expect(
          updateCase.mock.calls[0][0].caseToUpdate.docketEntries[3],
        ).toMatchObject({
          draftOrderState: {
            freeText:
              'Order parties by 11/05/2024 shall file a status report or proposed stipulated decision.',
          },
          freeText:
            'Order parties by 11/05/2024 shall file a status report or proposed stipulated decision.',
        });
      });

      it('should add order document to case and set freeText and draftOrderState.freeText correctly for orderType status report stipulated decision and when case is stricken from current trial session', async () => {
        await fileCourtIssuedOrderInteractor(
          applicationContext,
          {
            documentMetadata: {
              draftOrderState: {},
              dueDate: '2024-11-05',
              eventCode: 'O',
              orderType:
                STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.stipulatedDecision,
              strickenFromTrialSessions: true,
            },
            primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          },
          mockDocketClerkUser,
        );

        expect(getCaseByDocketNumber).toHaveBeenCalled();
        expect(
          updateCase.mock.calls[0][0].caseToUpdate.docketEntries[3],
        ).toMatchObject({
          draftOrderState: {
            freeText:
              'Order parties by 11/05/2024 shall file a status report or proposed stipulated decision. Case is stricken from the current trial session.',
          },
          freeText:
            'Order parties by 11/05/2024 shall file a status report or proposed stipulated decision. Case is stricken from the current trial session.',
        });
      });

      it('should add order document to case and set freeText and draftOrderState.freeText correctly for orderType status report stipulated decision and when case is stricken from current trial session and jurisdiction is restored to general docket', async () => {
        await fileCourtIssuedOrderInteractor(
          applicationContext,
          {
            documentMetadata: {
              draftOrderState: {},
              dueDate: '2024-11-05',
              eventCode: 'O',
              jurisdiction:
                STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.restored,
              orderType:
                STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.stipulatedDecision,
              strickenFromTrialSessions: true,
            },
            primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          },
          mockDocketClerkUser,
        );

        expect(getCaseByDocketNumber).toHaveBeenCalled();
        expect(
          updateCase.mock.calls[0][0].caseToUpdate.docketEntries[3],
        ).toMatchObject({
          draftOrderState: {
            freeText:
              'Order parties by 11/05/2024 shall file a status report or proposed stipulated decision. Case is stricken from the current trial session. Case is no longer jurisdiction retained and is restored to the general docket.',
          },
          freeText:
            'Order parties by 11/05/2024 shall file a status report or proposed stipulated decision. Case is stricken from the current trial session. Case is no longer jurisdiction retained and is restored to the general docket.',
        });
      });
    });

    describe('eventcode "OJR"', () => {
      it('should add order document to case and set freeText and draftOrderState.freeText correctly when order type is statusReport', async () => {
        await fileCourtIssuedOrderInteractor(
          applicationContext,
          {
            documentMetadata: {
              docketNumber: caseRecord.docketNumber,
              draftOrderState: {},
              dueDate: '2024-11-05',
              eventCode: 'O',
              jurisdiction:
                STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.retained,
              orderType:
                STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.statusReport,
              strickenFromTrialSessions: true,
            },
            primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          },
          mockDocketClerkUser,
        );
        expect(getCaseByDocketNumber).toHaveBeenCalled();
        expect(
          updateCase.mock.calls[0][0].caseToUpdate.docketEntries[3],
        ).toMatchObject({
          draftOrderState: {
            freeText:
              '. Parties by 11/05/2024 shall file a status report. Case is stricken from the current trial session.',
          },
          freeText:
            '. Parties by 11/05/2024 shall file a status report. Case is stricken from the current trial session.',
        });
      });

      it('should add order document to case and set freeText and draftOrderState.freeText correctly when order type is statusReportStipulatedDecision and case is stricken from the current trial session', async () => {
        await fileCourtIssuedOrderInteractor(
          applicationContext,
          {
            documentMetadata: {
              docketNumber: caseRecord.docketNumber,
              draftOrderState: {},
              dueDate: '2024-11-05',
              eventCode: 'O',
              jurisdiction:
                STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.retained,
              orderType:
                STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.stipulatedDecision,
              strickenFromTrialSessions: true,
            },
            primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          },
          mockDocketClerkUser,
        );
        expect(getCaseByDocketNumber).toHaveBeenCalled();
        expect(
          updateCase.mock.calls[0][0].caseToUpdate.docketEntries[3],
        ).toMatchObject({
          draftOrderState: {
            freeText:
              '. Parties by 11/05/2024 shall file a status report or proposed stipulated decision. Case is stricken from the current trial session.',
          },
          freeText:
            '. Parties by 11/05/2024 shall file a status report or proposed stipulated decision. Case is stricken from the current trial session.',
        });
      });

      it('should add order document to case and set freeText and draftOrderState.freeText correctly when case is stricken from the current trial session', async () => {
        await fileCourtIssuedOrderInteractor(
          applicationContext,
          {
            documentMetadata: {
              docketNumber: caseRecord.docketNumber,
              draftOrderState: {},
              eventCode: 'O',
              jurisdiction:
                STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.retained,
              strickenFromTrialSessions: true,
            },
            primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          },
          mockDocketClerkUser,
        );
        expect(getCaseByDocketNumber).toHaveBeenCalled();
        expect(
          updateCase.mock.calls[0][0].caseToUpdate.docketEntries[3],
        ).toMatchObject({
          draftOrderState: {
            freeText: '. Case is stricken from the current trial session.',
          },
          freeText: '. Case is stricken from the current trial session.',
        });
      });
    });
  });
});
