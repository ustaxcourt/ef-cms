import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import {
  FormattedPendingMotionWithWorksheet,
  getPendingMotionDocketEntriesForCurrentJudgeInteractor,
} from '@web-api/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
import { RawDocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  mockJudgeUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { getConsolidatedCasesCount as getConsolidatedCasesCountMock } from '@web-api/persistence/postgres/cases/getConsolidatedCasesCount';
import { getAllPendingMotionDocketEntriesForJudge as getAllPendingMotionDocketEntriesForJudgeMock } from '@web-api/persistence/postgres/docketEntries/reports/getAllPendingMotionDocketEntriesForJudge';

const getConsolidatedCasesCount = getConsolidatedCasesCountMock as jest.Mock;

const getAllPendingMotionDocketEntriesForJudge =
  getAllPendingMotionDocketEntriesForJudgeMock as jest.Mock;

jest.mock('@shared/business/utilities/DateHandler', () => {
  const originalModule = jest.requireActual(
    '@shared/business/utilities/DateHandler',
  );
  return {
    ...originalModule,
    prepareDateFromString: jest.fn(() => ({
      toISO: jest.fn(() => '2023-11-23T00:00:00.000Z'),
    })),
  };
});

describe('getPendingMotionDocketEntriesForCurrentJudgeInteractor', () => {
  const DOCKET_NUMBER = '101-22';
  const LEAD_DOCKET_NUMBER = '109-22';
  const DOCKET_ENTRY_ID = '1234-5678-9123-4567-8912';
  const LEAD_DOCKET_ENTRY_ID = '5678-5678-5678-5678-5678';

  const getAllPendingMotionDocketEntriesForJudgeResults: { results: any[] } = {
    results: [],
  };
  const getDocketEntryWorksheetsByDocketEntryIdsResults: RawDocketEntryWorksheet[] =
    [];

  beforeEach(() => {
    getAllPendingMotionDocketEntriesForJudge.mockResolvedValue(
      getAllPendingMotionDocketEntriesForJudgeResults,
    );

    getConsolidatedCasesCount.mockResolvedValue(1);

    applicationContext
      .getPersistenceGateway()
      .getDocketEntryWorksheetsByDocketEntryIds.mockReturnValue(
        getDocketEntryWorksheetsByDocketEntryIdsResults,
      );

    getAllPendingMotionDocketEntriesForJudgeResults.results = [];
  });

  it('should throw an error when the user does not have access to the case worksheet feature', async () => {
    await expect(
      getPendingMotionDocketEntriesForCurrentJudgeInteractor(
        applicationContext,
        {
          judgeIds: ['judgeId'],
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should return the single docket entry data for a pending motion ignoring non motions and those not over 180 days', async () => {
    getAllPendingMotionDocketEntriesForJudgeResults.results.push({
      docketEntryId: DOCKET_ENTRY_ID,
      docketNumber: DOCKET_NUMBER,
      eventCode: 'M218',
      filingDate: '2000-04-29T15:52:05.725Z',
      pending: true,
      daysSinceCreated: 8607,
      consolidatedGroupCount: 999,
      judge: 'Colvin',
      caseCaption: 'TEST_CASE_CAPTION',
      docketNumberWithSuffix: 'docketNumberWithSuffix',
      leadDocketNumber: DOCKET_NUMBER,
    });

    getDocketEntryWorksheetsByDocketEntryIdsResults.push({
      docketEntryId: DOCKET_ENTRY_ID,
      finalBriefDueDate: 'SOME FINAL BRIEF DUE DATE',
      primaryIssue: 'SOME PRIMARY ISSUE',
      statusOfMatter: 'SOME STATUS OF MATTER',
    });

    const results =
      await getPendingMotionDocketEntriesForCurrentJudgeInteractor(
        applicationContext,
        {
          judgeIds: ['judgeId'],
        },
        mockJudgeUser,
      );

    expect(
      getAllPendingMotionDocketEntriesForJudge.mock.calls[0][0].judgeIds,
    ).toEqual(['judgeId']);

    expect(results.docketEntries.length).toEqual(1);

    const expectedDocketEntry: FormattedPendingMotionWithWorksheet = {
      caseCaption: 'TEST_CASE_CAPTION',
      consolidatedGroupCount: 999,
      daysSinceCreated: 8607,
      docketEntryId: '1234-5678-9123-4567-8912',
      docketEntryWorksheet: {
        docketEntryId: '1234-5678-9123-4567-8912',
        finalBriefDueDate: 'SOME FINAL BRIEF DUE DATE',
        primaryIssue: 'SOME PRIMARY ISSUE',
        statusOfMatter: 'SOME STATUS OF MATTER',
      },
      docketNumber: DOCKET_NUMBER,
      docketNumberWithSuffix: 'docketNumberWithSuffix',
      eventCode: 'M218',
      filingDate: '2000-04-29T15:52:05.725Z',
      judge: 'Colvin',
      leadDocketNumber: DOCKET_NUMBER,
      pending: true,
    };
    expect(results.docketEntries).toEqual([expectedDocketEntry]);
  });

  it('should only return the lead case when a motion is mass sent using consolidated cases', async () => {
    getAllPendingMotionDocketEntriesForJudgeResults.results.push({
      daysSinceCreated: 8607,
      docketEntryId: LEAD_DOCKET_ENTRY_ID,
      docketNumber: LEAD_DOCKET_NUMBER,
      eventCode: 'M218',
      filingDate: '2000-04-29T15:52:05.725Z',
      pending: true,
      caseCaption: 'TEST_CASE_CAPTION',
      consolidatedGroupCount: 1,
      leadDocketNumber: LEAD_DOCKET_NUMBER,
    });

    getAllPendingMotionDocketEntriesForJudgeResults.results.push({
      daysSinceCreated: 8607,
      docketEntryId: LEAD_DOCKET_ENTRY_ID,
      docketNumber: DOCKET_NUMBER,
      eventCode: 'M218',
      filingDate: '2000-04-29T15:52:05.725Z',
      pending: true,
      caseCaption: 'TEST_CASE_CAPTION',
      consolidatedGroupCount: 1,
      leadDocketNumber: LEAD_DOCKET_NUMBER,
    });

    getDocketEntryWorksheetsByDocketEntryIdsResults.push({
      docketEntryId: DOCKET_ENTRY_ID,
      finalBriefDueDate: 'SOME FINAL BRIEF DUE DATE',
      primaryIssue: 'SOME PRIMARY ISSUE',
      statusOfMatter: 'SOME STATUS OF MATTER',
    });

    getDocketEntryWorksheetsByDocketEntryIdsResults.push({
      docketEntryId: LEAD_DOCKET_ENTRY_ID,
      finalBriefDueDate: 'LEAD SOME FINAL BRIEF DUE DATE',
      primaryIssue: 'LEAD SOME PRIMARY ISSUE',
      statusOfMatter: 'LEAD SOME STATUS OF MATTER',
    });

    const results =
      await getPendingMotionDocketEntriesForCurrentJudgeInteractor(
        applicationContext,
        {
          judgeIds: ['judgeId'],
        },
        mockJudgeUser,
      );

    expect(results.docketEntries.length).toEqual(1);
    const expectedDocketEntry: FormattedPendingMotionWithWorksheet = {
      caseCaption: 'TEST_CASE_CAPTION',
      consolidatedGroupCount: 1,
      daysSinceCreated: 8607,
      docketEntryId: LEAD_DOCKET_ENTRY_ID,
      docketEntryWorksheet: {
        docketEntryId: LEAD_DOCKET_ENTRY_ID,
        finalBriefDueDate: 'LEAD SOME FINAL BRIEF DUE DATE',
        primaryIssue: 'LEAD SOME PRIMARY ISSUE',
        statusOfMatter: 'LEAD SOME STATUS OF MATTER',
      },
      docketNumber: LEAD_DOCKET_NUMBER,
      eventCode: 'M218',
      filingDate: '2000-04-29T15:52:05.725Z',
      leadDocketNumber: LEAD_DOCKET_NUMBER,
      pending: true,
    };
    expect(results.docketEntries).toEqual([expectedDocketEntry]);
  });
});
