import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock',
);

import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';
import { SIGNED_DOCUMENT_TYPES } from '@shared/business/entities/EntityConstants';
import { addDocketEntryToCase } from './addDocketEntryToCase';
import { getDocketEntryMetaForCase as getDocketEntryMetaForCaseMock } from '@web-api/persistence/postgres/docketEntries/getDocketEntryMetaForCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { updateCaseAutomaticBlock as updateCaseAutomaticBlockMock } from '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock';
import { upsertCases as upsertCasesMock } from '@web-api/persistence/postgres/cases/upsertCases';
import { upsertDocketEntries as upsertDocketEntriesMock } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';

describe('addDocketEntryToCase', () => {
  const getDocketEntryMetaForCase =
    getDocketEntryMetaForCaseMock as jest.Mock;
  const updateCaseAutomaticBlock = jest.mocked(updateCaseAutomaticBlockMock);
  const upsertCases = jest.mocked(upsertCasesMock);
  const upsertDocketEntries = jest.mocked(upsertDocketEntriesMock);

  let caseEntity: Case;

  beforeEach(() => {
    caseEntity = new Case(MOCK_CASE, { authorizedUser: mockDocketClerkUser });

    getDocketEntryMetaForCase.mockResolvedValue({
      hasDocketedStipDecision: false,
      hasPendingDocketEntries: false,
      nextDocketEntryIndex: 5,
      petitionServedAt: '2020-01-01T00:00:00.000Z',
    });

    updateCaseAutomaticBlock.mockImplementation(({ caseEntity: ce }) =>
      Promise.resolve(ce),
    );
  });

  it('should add a docket entry to the case and persist both', async () => {
    const docketEntryEntity = new DocketEntry(MOCK_DOCUMENTS[0], {
      authorizedUser: mockDocketClerkUser,
      petitioners: MOCK_CASE.petitioners,
    });

    await addDocketEntryToCase({
      caseEntity,
      docketEntryEntity,
    });

    expect(getDocketEntryMetaForCase).toHaveBeenCalledWith(
      caseEntity.docketNumber,
    );
    expect(updateCaseAutomaticBlock).toHaveBeenCalled();
    expect(upsertDocketEntries).toHaveBeenCalled();
    expect(upsertCases).toHaveBeenCalled();
  });

  it('should set hasPendingItems to true when meta has pending docket entries', async () => {
    getDocketEntryMetaForCase.mockResolvedValue({
      hasDocketedStipDecision: false,
      hasPendingDocketEntries: true,
      nextDocketEntryIndex: 5,
      petitionServedAt: '2020-01-01T00:00:00.000Z',
    });

    const docketEntryEntity = new DocketEntry(MOCK_DOCUMENTS[0], {
      authorizedUser: mockDocketClerkUser,
      petitioners: MOCK_CASE.petitioners,
    });

    await addDocketEntryToCase({
      caseEntity,
      docketEntryEntity,
    });

    const updateBlockCall = updateCaseAutomaticBlock.mock.calls[0][0];
    expect(updateBlockCall.hasPendingItems).toBe(true);
  });

  it('should set hasDocketedStipDecision to true when meta already has a stip decision', async () => {
    getDocketEntryMetaForCase.mockResolvedValue({
      hasDocketedStipDecision: true,
      hasPendingDocketEntries: false,
      nextDocketEntryIndex: 6,
      petitionServedAt: '2020-01-01T00:00:00.000Z',
    });

    const docketEntryEntity = new DocketEntry(MOCK_DOCUMENTS[0], {
      authorizedUser: mockDocketClerkUser,
      petitioners: MOCK_CASE.petitioners,
    });

    await addDocketEntryToCase({
      caseEntity,
      docketEntryEntity,
    });

    const updateBlockCall = updateCaseAutomaticBlock.mock.calls[0][0];
    expect(updateBlockCall.hasDocketedStipDecision).toBe(true);
  });

  it('should detect a signed stipulated decision on the docket record', async () => {
    const stipDecisionEntry = new DocketEntry(
      {
        ...MOCK_DOCUMENTS[0],
        eventCode: SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.eventCode,
        isOnDocketRecord: true,
        signedAt: '2020-01-01T00:00:00.000Z',
        signedByUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        signedJudgeName: 'Judge Buch',
      },
      {
        authorizedUser: mockDocketClerkUser,
        petitioners: MOCK_CASE.petitioners,
      },
    );

    await addDocketEntryToCase({
      caseEntity,
      docketEntryEntity: stipDecisionEntry,
    });

    const updateBlockCall = updateCaseAutomaticBlock.mock.calls[0][0];
    expect(updateBlockCall.hasDocketedStipDecision).toBe(true);
  });
});
