import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock',
);
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
jest.mock(
  '@web-api/business/useCaseHelper/docketEntry/closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments',
);
jest.mock('@web-api/persistence/dynamo/cases/getCaseByDocketNumber');
import {
  COURT_ISSUED_EVENT_CODES,
  DOCKET_SECTION,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { ENTERED_AND_SERVED_EVENT_CODES } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import {
  MOCK_CASE,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} from '../../../../../shared/src/test/mockCase';
import { WorkItem } from '../../../../../shared/src/business/entities/WorkItem';
import { createISODateString } from '../../../../../shared/src/business/utilities/DateHandler';
import {
  docketClerkUser,
  judgeUser,
} from '../../../../../shared/src/test/mockUsers';
import { fileAndServeDocumentOnOneCase } from './fileAndServeDocumentOnOneCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { upsertWorkItems as upsertWorkItemsMock } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { updateCaseAutomaticBlock as updateCaseAutomaticBlockMock } from '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments as closeCaseAndUpdateTrialSessionForEnteredAndServedDocumentsMock } from '@web-api/business/useCaseHelper/docketEntry/closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/dynamo/cases/getCaseByDocketNumber';

describe('fileAndServeDocumentOnOneCase', () => {
  let mockCaseEntity;
  let mockWorkItem;
  let mockDocketEntry;

  const updateCaseAutomaticBlock = jest.mocked(updateCaseAutomaticBlockMock);
  const closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments =
    jest.mocked(closeCaseAndUpdateTrialSessionForEnteredAndServedDocumentsMock);
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const upsertWorkItems = jest.mocked(upsertWorkItemsMock);
  const mockDocketEntryId = '85a5b1c81eed44b6932a967af060597a';
  const differentDocketNumber = '3875-32';
  const docketEntriesWithCaseClosingEventCodes =
    ENTERED_AND_SERVED_EVENT_CODES.map(eventCode => {
      const eventCodeMap = COURT_ISSUED_EVENT_CODES.find(
        entry => entry.eventCode === eventCode,
      );

      return new DocketEntry(
        {
          docketEntryId: mockDocketEntryId,
          docketNumber: MOCK_CASE.docketNumber,
          documentType: eventCodeMap?.documentType,
          eventCode,
          filedByRole: ROLES.judge,
          signedAt: createISODateString(),
          signedByUserId: 'ab540a2d-2e61-4ec3-be8e-ea744d12a283',
          signedJudgeName: 'Chief Judge',
          userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
          workItem: {
            docketNumber: MOCK_CASE.docketNumber,
            section: docketClerkUser.section,
            sentBy: docketClerkUser.name,
            sentByUserId: docketClerkUser.userId,
            workItemId: 'b4c7337f-9ca0-45d9-9396-75e003f81e32',
          },
        },
        { authorizedUser: undefined },
      );
    });

  jest.spyOn(Case.prototype, 'addDocketEntry');
  jest.spyOn(Case.prototype, 'updateDocketEntry');
  jest.spyOn(DocketEntry.prototype, 'setAsServed');
  jest.spyOn(WorkItem.prototype, 'validate');
  jest.spyOn(WorkItem.prototype, 'assignToUser');
  jest.spyOn(WorkItem.prototype, 'setAsCompleted');

  beforeEach(() => {
    mockCaseEntity = new Case(MOCK_CASE, {
      authorizedUser: mockDocketClerkUser,
    });

    updateCaseAndAssociations.mockImplementation(({ caseToUpdate }) =>
      Promise.resolve(caseToUpdate),
    );
    updateCaseAutomaticBlock.mockImplementation(({ caseEntity }) =>
      Promise.resolve(caseEntity),
    );

    mockWorkItem = {
      docketNumber: differentDocketNumber,
      section: DOCKET_SECTION,
      sentBy: docketClerkUser.name,
      sentByUserId: docketClerkUser.userId,
      workItemId: 'b4c7337f-9ca0-45d9-9396-75e003f81e32',
    };
    mockDocketEntry = new DocketEntry(
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: mockCaseEntity.docketNumber,
        documentType: 'Order',
        eventCode: 'O',
        filedByRole: ROLES.judge,
        judge: judgeUser.name,
        numberOfPages: 1,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
        workItem: mockWorkItem,
      },
      { authorizedUser: undefined },
    );
  });

  it('should set the docketEntry as served', async () => {
    mockDocketEntry = new DocketEntry(
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: mockCaseEntity.docketNumber,
        documentType: 'Order',
        eventCode: 'O',
        filedByRole: ROLES.judge,
        judge: judgeUser.name,
        numberOfPages: 1,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
        workItem: undefined,
      },
      { authorizedUser: undefined },
    );

    await fileAndServeDocumentOnOneCase({
      caseEntity: mockCaseEntity,
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(DocketEntry.prototype.setAsServed).toHaveBeenCalled();
  });

  it('should not add a new docket entry when it already exists on the case', async () => {
    const docketEntryOnCase = new DocketEntry(mockCaseEntity.docketEntries[0], {
      authorizedUser: undefined,
    });

    await fileAndServeDocumentOnOneCase({
      caseEntity: mockCaseEntity,
      docketEntryEntity: docketEntryOnCase,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(Case.prototype.addDocketEntry).not.toHaveBeenCalled();
  });

  it('should create a new work item for the docketEntry when it does not already have one', async () => {
    mockDocketEntry = new DocketEntry(
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: mockCaseEntity.docketNumber,
        documentType: 'Order',
        eventCode: 'O',
        filedByRole: ROLES.judge,
        judge: judgeUser.name,
        numberOfPages: 1,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
        workItem: undefined,
      },
      { authorizedUser: undefined },
    );

    await fileAndServeDocumentOnOneCase({
      caseEntity: mockCaseEntity,
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    const expectedDocketEntry =
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
        doc => doc.docketEntryId === mockDocketEntryId,
      );
    expect(expectedDocketEntry.workItem).toBeDefined();
  });

  it('should create a new work item for the docketEntry when the docketNumber on the originalSubjectDocketEntry does not match the docketNumber of the case to file the docketEntry on', async () => {
    mockWorkItem = {
      docketNumber: differentDocketNumber,
      section: DOCKET_SECTION,
      sentBy: docketClerkUser.name,
      sentByUserId: docketClerkUser.userId,
      workItemId: 'b4c7337f-9ca0-45d9-9396-75e003f81e32',
    };
    mockDocketEntry = new DocketEntry(
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: mockCaseEntity.docketNumber,
        documentType: 'Order',
        eventCode: 'O',
        filedByRole: ROLES.judge,
        judge: judgeUser.name,
        numberOfPages: 1,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
        workItem: mockWorkItem,
      },
      { authorizedUser: undefined },
    );

    await fileAndServeDocumentOnOneCase({
      caseEntity: mockCaseEntity,
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
      user: docketClerkUser,
    });

    const expectedDocketEntry =
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
        doc => doc.docketEntryId === mockDocketEntryId,
      );
    expect(expectedDocketEntry.workItem).toMatchObject({
      docketNumber: mockCaseEntity.docketNumber,
      section: DOCKET_SECTION,
    });
  });

  it('should set docketEntry.workItem.leadDocketNumber from caseEntity.leadDocketNumber', async () => {
    await fileAndServeDocumentOnOneCase({
      caseEntity: new Case(
        { ...MOCK_CASE, leadDocketNumber: MOCK_CASE.docketNumber },
        {
          authorizedUser: mockDocketClerkUser,
        },
      ),
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(upsertWorkItems.mock.calls[0][0].workItems[0].leadDocketNumber).toBe(
      MOCK_CASE.docketNumber,
    );
  });

  it('should assign the docketEntry`s work item to the provided user', async () => {
    await fileAndServeDocumentOnOneCase({
      caseEntity: new Case(
        { ...MOCK_CASE, leadDocketNumber: MOCK_CASE.docketNumber },
        {
          authorizedUser: mockDocketClerkUser,
        },
      ),
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(WorkItem.prototype.assignToUser).toHaveBeenCalledWith({
      assigneeId: docketClerkUser.userId,
      assigneeName: docketClerkUser.name,
      section: docketClerkUser.section,
      sentBy: docketClerkUser.name,
      sentBySection: docketClerkUser.section,
      sentByUserId: docketClerkUser.userId,
    });
  });

  it('should set the docketEntry`s work item as completed by the provided user', async () => {
    await fileAndServeDocumentOnOneCase({
      caseEntity: new Case(
        { ...MOCK_CASE, leadDocketNumber: MOCK_CASE.docketNumber },
        {
          authorizedUser: mockDocketClerkUser,
        },
      ),
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(WorkItem.prototype.setAsCompleted).toHaveBeenCalledWith({
      message: 'completed',
      user: docketClerkUser,
    });
  });

  it('should update the docketEntry on the caseEntity when it already existed on the case', async () => {
    await fileAndServeDocumentOnOneCase({
      caseEntity: mockCaseEntity,
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(Case.prototype.updateDocketEntry).toHaveBeenCalled();
  });

  it('should add an index to the docketEntry on the caseEntity', async () => {
    const result = await fileAndServeDocumentOnOneCase({
      caseEntity: mockCaseEntity,
      docketEntryEntity: new DocketEntry(
        {
          ...mockDocketEntry,
          index: undefined,
          isOnDocketRecord: true,
        },
        { authorizedUser: undefined },
      ),
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(Case.prototype.updateDocketEntry).toHaveBeenCalled();
    expect(
      result.docketEntries.find(
        docketEntry =>
          docketEntry.docketEntryId === mockDocketEntry.docketEntryId,
      ).index,
    ).toBeDefined();
  });

  it('should add the docketEntry on the caseEntity when it did NOT already exist on the case', async () => {
    await fileAndServeDocumentOnOneCase({
      caseEntity: mockCaseEntity,
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(Case.prototype.addDocketEntry).toHaveBeenCalled();
  });

  it('should validate the docketEntry`s work item', async () => {
    await fileAndServeDocumentOnOneCase({
      caseEntity: mockCaseEntity,
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(WorkItem.prototype.validate).toHaveBeenCalled();
  });

  it('should make a call to save the docketEntry`s work item', async () => {
    await fileAndServeDocumentOnOneCase({
      caseEntity: mockCaseEntity,
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(upsertWorkItems).toHaveBeenCalled();
  });

  it('should pass the caseEntity`s trialDate and trialLocation to the docketEntry`s work item when they exist', async () => {
    mockCaseEntity = new Case(
      {
        ...MOCK_CASE,
        trialDate: '2021-01-02T05:22:16.001Z',
        trialLocation: 'Lubbock, Texas',
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    mockDocketEntry = new DocketEntry(
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: mockCaseEntity.docketNumber,
        documentType: 'Order',
        eventCode: 'O',
        filedByRole: ROLES.judge,
        judge: judgeUser.name,
        numberOfPages: 1,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
        workItem: undefined,
      },
      { authorizedUser: undefined },
    );

    await fileAndServeDocumentOnOneCase({
      caseEntity: mockCaseEntity,
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    const expectedDocketEntry =
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
        doc => doc.docketEntryId === mockDocketEntryId,
      );

    expect(expectedDocketEntry.workItem).toMatchObject({
      trialDate: mockCaseEntity.trialDate,
      trialLocation: mockCaseEntity.trialLocation,
    });
  });

  it('should make a call to close the case and update trial session information when the docketEntry being filed is one of "ENTERED_AND_SERVED_EVENT_CODES"', async () => {
    const a = new DocketEntry(
      {
        ...mockDocketEntry,
        docketEntryId: mockDocketEntryId,
        documentType: 'Order of Dismissal for Lack of Jurisdiction',
        eventCode: ENTERED_AND_SERVED_EVENT_CODES[0],
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
      },
      { authorizedUser: undefined },
    );

    await fileAndServeDocumentOnOneCase({
      caseEntity: mockCaseEntity,
      docketEntryEntity: a,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(
      closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments,
    ).toHaveBeenCalled();
    expect(updateCaseAutomaticBlock).toHaveBeenCalled();
  });

  it('should make a call save the case', async () => {
    await fileAndServeDocumentOnOneCase({
      caseEntity: mockCaseEntity,
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(updateCaseAndAssociations).toHaveBeenCalled();
  });

  it('should return the updated case entity', async () => {
    const result = await fileAndServeDocumentOnOneCase({
      caseEntity: mockCaseEntity,
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(result.entityName).toBe('Case');
    expect(
      result.getDocketEntryById({ docketEntryId: mockDocketEntryId }),
    ).toBeDefined();
  });

  docketEntriesWithCaseClosingEventCodes.forEach(docketEntry => {
    it(`should set the case status to closed for event code: ${docketEntry.eventCode}`, async () => {
      getCaseByDocketNumber.mockResolvedValue({
        ...MOCK_CASE,
        docketEntries: [docketEntry],
      });

      await fileAndServeDocumentOnOneCase({
        caseEntity: mockCaseEntity,
        docketEntryEntity: docketEntry,
        subjectCaseDocketNumber: mockCaseEntity.docketNumber,
        user: docketClerkUser,
      });

      expect(
        closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments,
      ).toHaveBeenCalled();
    });
  });
});
