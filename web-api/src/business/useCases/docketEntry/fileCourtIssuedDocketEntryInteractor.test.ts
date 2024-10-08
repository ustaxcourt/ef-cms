import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import {
  DOCKET_SECTION,
  ROLES,
  TRANSCRIPT_EVENT_CODE,
} from '../../../../../shared/src/business/entities/EntityConstants';
import {
  MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} from '../../../../../shared/src/test/mockCase';
import { MOCK_LOCK } from '../../../../../shared/src/test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { fileCourtIssuedDocketEntryInteractor } from './fileCourtIssuedDocketEntryInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { saveWorkItem } from '@web-api/persistence/postgres/workitems/saveWorkItem';

describe('fileCourtIssuedDocketEntryInteractor', () => {
  let caseRecord;
  const mockUserId = mockDocketClerkUser.userId;
  const docketClerkUser = {
    name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
    role: ROLES.docketClerk,
    section: DOCKET_SECTION,
    userId: mockUserId,
  };
  let mockLock;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    caseRecord = {
      ...MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
      docketEntries: [
        {
          docketEntryId: 'a01afa63-931e-4999-99f0-c892c51292d6',
          docketNumber: '45678-18',
          documentTitle: 'Order',
          documentType: 'Order',
          eventCode: 'O',
          filedByRole: ROLES.docketClerk,
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
          userId: mockUserId,
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          docketNumber: '45678-18',
          documentTitle: 'Order to Show Cause',
          documentType: 'Order to Show Cause',
          eventCode: 'OSC',
          filedByRole: ROLES.docketClerk,
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
          userId: mockUserId,
        },
        {
          docketEntryId: '7f61161c-ede8-43ba-8fab-69e15d057012',
          docketNumber: '45678-18',
          documentTitle: 'Transcript of [anything] on [date]',
          documentType: 'Transcript',
          eventCode: TRANSCRIPT_EVENT_CODE,
          filedByRole: ROLES.docketClerk,
          userId: mockUserId,
        },
      ],
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(caseRecord);
  });

  it('should throw an error if not authorized', async () => {
    await expect(
      fileCourtIssuedDocketEntryInteractor(
        applicationContext,
        {
          docketNumbers: [],
          documentMeta: {
            docketEntryId: caseRecord.docketEntries[1].docketEntryId,
            documentType: 'Memorandum in Support',
          },
          subjectDocketNumber: caseRecord.docketNumber,
        } as any,
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if the document is not found on the case', async () => {
    await expect(
      fileCourtIssuedDocketEntryInteractor(
        applicationContext,
        {
          documentMeta: {
            docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
            docketNumbers: [],
            documentType: 'Order',
          },
          subjectDocketNumber: caseRecord.docketNumber,
        } as any,
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Docket entry not found');
  });

  it('should throw an error if the document has already been added to the docket record', async () => {
    caseRecord.docketEntries[1].isOnDocketRecord = true;

    await expect(
      fileCourtIssuedDocketEntryInteractor(
        applicationContext,
        {
          docketNumbers: [],
          documentMeta: {
            docketEntryId: caseRecord.docketEntries[1].docketEntryId,
            documentType: 'Order',
          },
          subjectDocketNumber: caseRecord.docketNumber,
        } as any,
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Docket entry has already been added to docket record');
  });

  it('should call countPagesInDocument, updateCase, and saveWorkItem', async () => {
    await fileCourtIssuedDocketEntryInteractor(
      applicationContext,
      {
        docketNumbers: [],
        documentMeta: {
          docketEntryId: caseRecord.docketEntries[0].docketEntryId,
          documentTitle: 'Order',
          documentType: 'Order',
          eventCode: 'O',
          generatedDocumentTitle: 'Generated Order Document Title',
        },
        subjectDocketNumber: caseRecord.docketNumber,
      } as any,
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(saveWorkItem).toHaveBeenCalled();
  });

  it('should call updateCase with the docket entry set as pending if the document is a tracked document', async () => {
    await fileCourtIssuedDocketEntryInteractor(
      applicationContext,
      {
        docketNumbers: [],
        documentMeta: {
          docketEntryId: caseRecord.docketEntries[1].docketEntryId,
          documentTitle: 'Order to Show Cause',
          documentType: 'Order to Show Cause',
          eventCode: 'OSC',
          filingDate: '2011-03-01T21:40:46.415Z',
          generatedDocumentTitle: 'Generated Order Document Title',
        },
        subjectDocketNumber: caseRecord.docketNumber,
      } as any,
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    const { caseToUpdate } =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0];
    const docketEntryInCaseToUpdate = caseToUpdate.docketEntries.find(
      d => d.docketEntryId === caseRecord.docketEntries[1].docketEntryId,
    );
    expect(docketEntryInCaseToUpdate).toMatchObject({
      docketEntryId: caseRecord.docketEntries[1].docketEntryId,
      filingDate: '2011-03-01T21:40:46.415Z',
      pending: true,
    });
  });

  it('should set isDraft to false on a document when creating a court issued docket entry', async () => {
    await fileCourtIssuedDocketEntryInteractor(
      applicationContext,
      {
        docketNumbers: [],
        documentMeta: {
          date: '2019-03-01T21:40:46.415Z',
          docketEntryId: caseRecord.docketEntries[2].docketEntryId,
          documentTitle: 'Transcript of [anything] on [date]',
          documentType: 'Transcript',
          eventCode: TRANSCRIPT_EVENT_CODE,
          freeText: 'Dogs',
          generatedDocumentTitle: 'Transcript of Dogs on 03-01-19',
          isDraft: true,
        },
        subjectDocketNumber: caseRecord.docketNumber,
      } as any,
      mockDocketClerkUser,
    );

    const lastDocumentIndex =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries.length - 1;

    const newlyFiledDocument =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries[lastDocumentIndex];

    expect(newlyFiledDocument).toMatchObject({
      isDraft: false,
    });
  });

  it('should delete the draftOrderState from the docketEntry', async () => {
    const docketEntryToUpdate = caseRecord.docketEntries[2];
    await fileCourtIssuedDocketEntryInteractor(
      applicationContext,
      {
        docketNumbers: [],
        documentMeta: {
          docketEntryId: docketEntryToUpdate.docketEntryId,
          documentTitle: docketEntryToUpdate.documentTitle,
          documentType: docketEntryToUpdate.documentType,
          draftOrderState: {
            documentContents: 'Some content',
            richText: 'some content',
          },
          eventCode: docketEntryToUpdate.eventCode,
        },
        subjectDocketNumber: caseRecord.docketNumber,
      } as any,
      mockDocketClerkUser,
    );

    const updatedDocketEntry = applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
        d => d.docketEntryId === docketEntryToUpdate.docketEntryId,
      );

    expect(updatedDocketEntry).toMatchObject({ draftOrderState: null });
  });

  it('should add docketEntry to caseEntity when not already on caseEntity', async () => {
    const LEAD_CASE = {
      ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
      docketEntries: [
        {
          docketEntryId: 'b01afa63-931e-4999-99f0-c892c51292d6',
          docketNumber: '109-19',
          documentTitle: 'Some Title',
          documentType: 'Trial Exhibits',
          eventCode: 'TE',
          filedByRole: ROLES.docketClerk,
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
          userId: mockUserId,
        },
      ],
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce(LEAD_CASE);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce(
        MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
      );
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce(LEAD_CASE);

    await fileCourtIssuedDocketEntryInteractor(
      applicationContext,
      {
        docketNumbers: [
          MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
        ],
        documentMeta: {
          docketEntryId: LEAD_CASE.docketEntries[0].docketEntryId,

          documentType: 'Trial Exhibits',
          eventCode: 'TE',
          freeText: 'free text testing',
        },
        subjectDocketNumber: LEAD_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    const docketEntryOnNonLead = applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
        entry => entry.eventCode === 'TE',
      );
    expect(docketEntryOnNonLead).toMatchObject({
      docketNumber: MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
      freeText: 'free text testing',
    });
    const docketEntryOnLead = applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mock.calls[1][0].caseToUpdate.docketEntries.find(
        entry => entry.eventCode === 'TE',
      );
    expect(docketEntryOnLead).toMatchObject({
      docketNumber: LEAD_CASE.docketNumber,
      freeText: 'free text testing',
    });
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      fileCourtIssuedDocketEntryInteractor(
        applicationContext,
        {
          docketNumbers: [],
          documentMeta: {
            docketEntryId: caseRecord.docketEntries[0].docketEntryId,
            documentTitle: 'Order',
            documentType: 'Order',
            eventCode: 'O',
            generatedDocumentTitle: 'Generated Order Document Title',
          },
          subjectDocketNumber: caseRecord.docketNumber,
        } as any,
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await fileCourtIssuedDocketEntryInteractor(
      applicationContext,
      {
        docketNumbers: [],
        documentMeta: {
          docketEntryId: caseRecord.docketEntries[0].docketEntryId,
          documentTitle: 'Order',
          documentType: 'Order',
          eventCode: 'O',
          generatedDocumentTitle: 'Generated Order Document Title',
        },
        subjectDocketNumber: caseRecord.docketNumber,
      } as any,
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

  it('should acquire and remove the lock for every case', async () => {
    const docketNumbers = ['888-88', '999-99'];
    await fileCourtIssuedDocketEntryInteractor(
      applicationContext,
      {
        docketNumbers,
        documentMeta: {
          docketEntryId: caseRecord.docketEntries[0].docketEntryId,
          documentTitle: 'Order',
          documentType: 'Order',
          eventCode: 'O',
          generatedDocumentTitle: 'Generated Order Document Title',
        },
        subjectDocketNumber: caseRecord.docketNumber,
      } as any,
      mockDocketClerkUser,
    );

    const expectedIdentifiers = docketNumbers.map(
      docketNumber => `case|${docketNumber}`,
    );
    expectedIdentifiers.unshift(`case|${caseRecord.docketNumber}`);
    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledTimes(3);
    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: expectedIdentifiers,
    });

    [caseRecord.docketNumber, '888-88', '999-99'].forEach(docketNumber => {
      expect(
        applicationContext.getPersistenceGateway().createLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifier: `case|${docketNumber}`,
        ttl: 30,
      });
    });
  });
});
