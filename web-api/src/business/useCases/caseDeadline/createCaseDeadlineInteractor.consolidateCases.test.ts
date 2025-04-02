import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
jest.mock('@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines');
import {
  CaseDeadline,
  RawCaseDeadline,
} from '@shared/business/entities/CaseDeadline';
import { Case } from '@shared/business/entities/cases/Case';
import { CHIEF_JUDGE } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { upsertCaseDeadlines } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';
import { getUniqueId } from '@shared/sharedAppContext';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';
import { createCaseDeadline } from '@web-api/business/useCases/caseDeadline/createCaseDeadlineInteractor';
import { MOCK_CASE } from '@shared/test/mockCase';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCase as updateCaseMock } from '@web-api/persistence/postgres/cases/updateCase';

const updateCase = jest.mocked(updateCaseMock);
updateCase.mockImplementation(({ caseToUpdate }) =>
  Promise.resolve(caseToUpdate),
);
const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;

describe('createCaseDeadlineInteractor - Consolidated Cases', () => {
  const LEAD_DOCKET_NUMBER = '101-25';
  const CHILD_DOCKET_NUMBER = '102-25';
  const CASE_DEADLINE_ID = getUniqueId();

  it('should create a case deadline for all the cases in the consolidated group', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      docketNumber: LEAD_DOCKET_NUMBER,
      leadDocketNumber: LEAD_DOCKET_NUMBER,
      consolidatedCases: [
        {
          ...MOCK_CASE,
          docketNumber: LEAD_DOCKET_NUMBER,
        },
        {
          ...MOCK_CASE,
          docketNumber: CHILD_DOCKET_NUMBER,
        },
      ],
    } as RawCase);

    const TEST_CASE_DEADLINE = {
      associatedJudge: CHIEF_JUDGE,
      associatedJudgeId: getUniqueId(),
      caseDeadlineId: CASE_DEADLINE_ID,
      consolidatedCaseDeadlineId: undefined,
      createdAt: '9999-11-21T20:49:28.192Z',
      deadlineDate: '9999-11-21T20:49:28.192Z',
      description: 'TEST_DESCRIPTION',
      docketNumber: LEAD_DOCKET_NUMBER,
      sortableDocketNumber: Case.getSortableDocketNumber(LEAD_DOCKET_NUMBER)!,
    } as RawCaseDeadline;

    await createCaseDeadline(
      applicationContext,
      {
        caseDeadline: new CaseDeadline(TEST_CASE_DEADLINE),
      },
      mockPetitionsClerkUser,
    );

    const upsertCaseDeadlinesCalls = (upsertCaseDeadlines as jest.Mock).mock
      .calls;
    expect(upsertCaseDeadlinesCalls.length).toEqual(2);
    expect(upsertCaseDeadlinesCalls[0][0]).toMatchObject([
      {
        docketNumber: LEAD_DOCKET_NUMBER,
        consolidatedCaseDeadlineId: undefined,
        caseDeadlineId: CASE_DEADLINE_ID,
      },
    ]);
    expect(upsertCaseDeadlinesCalls[1][0]).toMatchObject([
      {
        docketNumber: CHILD_DOCKET_NUMBER,
        consolidatedCaseDeadlineId: CASE_DEADLINE_ID,
        caseDeadlineId: expect.anything(),
      },
    ]);
  });

  it('should not create a case deadline for the child cases if the flag "handlingConsolidatedCases" is true', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      docketNumber: LEAD_DOCKET_NUMBER,
      leadDocketNumber: LEAD_DOCKET_NUMBER,
      consolidatedCases: [
        {
          ...MOCK_CASE,
          docketNumber: LEAD_DOCKET_NUMBER,
        },
        {
          ...MOCK_CASE,
          docketNumber: CHILD_DOCKET_NUMBER,
        },
      ],
    } as RawCase);

    const TEST_CASE_DEADLINE = {
      associatedJudge: CHIEF_JUDGE,
      associatedJudgeId: getUniqueId(),
      caseDeadlineId: CASE_DEADLINE_ID,
      consolidatedCaseDeadlineId: undefined,
      createdAt: '9999-11-21T20:49:28.192Z',
      deadlineDate: '9999-11-21T20:49:28.192Z',
      description: 'TEST_DESCRIPTION',
      docketNumber: LEAD_DOCKET_NUMBER,
      sortableDocketNumber: Case.getSortableDocketNumber(LEAD_DOCKET_NUMBER)!,
    } as RawCaseDeadline;

    await createCaseDeadline(
      applicationContext,
      {
        caseDeadline: new CaseDeadline(TEST_CASE_DEADLINE),
        handlingConsolidatedCases: true,
      },
      mockPetitionsClerkUser,
    );

    const upsertCaseDeadlinesCalls = (upsertCaseDeadlines as jest.Mock).mock
      .calls;
    expect(upsertCaseDeadlinesCalls.length).toEqual(1);
    expect(upsertCaseDeadlinesCalls[0][0]).toMatchObject([
      {
        docketNumber: LEAD_DOCKET_NUMBER,
        consolidatedCaseDeadlineId: undefined,
        caseDeadlineId: CASE_DEADLINE_ID,
      },
    ]);
  });

  it('should not create a case deadline for all the cases in the consolidated group if its being added to a child case', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      docketNumber: CHILD_DOCKET_NUMBER,
      leadDocketNumber: LEAD_DOCKET_NUMBER,
      consolidatedCases: [
        {
          ...MOCK_CASE,
          docketNumber: LEAD_DOCKET_NUMBER,
        },
        {
          ...MOCK_CASE,
          docketNumber: CHILD_DOCKET_NUMBER,
        },
      ],
    } as RawCase);

    const TEST_CASE_DEADLINE = {
      associatedJudge: CHIEF_JUDGE,
      associatedJudgeId: getUniqueId(),
      caseDeadlineId: CASE_DEADLINE_ID,
      consolidatedCaseDeadlineId: undefined,
      createdAt: '9999-11-21T20:49:28.192Z',
      deadlineDate: '9999-11-21T20:49:28.192Z',
      description: 'TEST_DESCRIPTION',
      docketNumber: CHILD_DOCKET_NUMBER,
      sortableDocketNumber: Case.getSortableDocketNumber(LEAD_DOCKET_NUMBER)!,
    } as RawCaseDeadline;

    await createCaseDeadline(
      applicationContext,
      {
        caseDeadline: new CaseDeadline(TEST_CASE_DEADLINE),
      },
      mockPetitionsClerkUser,
    );

    const upsertCaseDeadlinesCalls = (upsertCaseDeadlines as jest.Mock).mock
      .calls;
    expect(upsertCaseDeadlinesCalls.length).toEqual(1);
    expect(upsertCaseDeadlinesCalls[0][0]).toMatchObject([
      {
        docketNumber: CHILD_DOCKET_NUMBER,
        consolidatedCaseDeadlineId: undefined,
        caseDeadlineId: CASE_DEADLINE_ID,
      },
    ]);
  });
});
