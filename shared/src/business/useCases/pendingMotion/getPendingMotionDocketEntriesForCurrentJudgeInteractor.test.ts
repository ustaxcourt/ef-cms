import {
  FormattedPendingMotionWithWorksheet,
  getPendingMotionDocketEntriesForCurrentJudgeInteractor,
} from '@shared/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
import { RawDocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { judgeColvin, petitionsClerkUser } from '@shared/test/mockUsers';

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
  const CASE_BY_DOCKET_NUMBER: { [key: string]: any } = {};

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(judgeColvin);

    applicationContext
      .getPersistenceGateway()
      .getAllPendingMotionDocketEntriesForJudge.mockReturnValue(
        getAllPendingMotionDocketEntriesForJudgeResults,
      );

    applicationContext
      .getPersistenceGateway()
      .getCaseMetadataByDocketNumber.mockImplementation(
        ({ docketNumber }: { docketNumber: string }) => {
          return CASE_BY_DOCKET_NUMBER[docketNumber];
        },
      );

    applicationContext
      .getPersistenceGateway()
      .getConsolidatedCasesCount.mockResolvedValue(1);

    applicationContext
      .getPersistenceGateway()
      .getDocketEntryOnCase.mockResolvedValue({
        docketEntryId: DOCKET_ENTRY_ID,
        documentTitle: 'TEST_DOCUMENT_TITLE',
        eventCode: 'M218',
        filingDate: '2000-04-29T15:52:05.725Z',
        pending: true,
      });

    applicationContext
      .getPersistenceGateway()
      .getDocketEntryWorksheetsByDocketEntryIds.mockReturnValue(
        getDocketEntryWorksheetsByDocketEntryIdsResults,
      );

    getAllPendingMotionDocketEntriesForJudgeResults.results = [];
  });

  it('should throw an error when the user does not have access to the case worksheet feature', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    await expect(
      getPendingMotionDocketEntriesForCurrentJudgeInteractor(
        applicationContext,
        {
          judges: ['Colvin'],
        },
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should return the single docket entry data for a pending motion ignoring non motions and thos not over 180 days', async () => {
    getAllPendingMotionDocketEntriesForJudgeResults.results.push({
      docketEntryId: DOCKET_ENTRY_ID,
      docketNumber: DOCKET_NUMBER,
      eventCode: 'M218',
      filingDate: '2000-04-29T15:52:05.725Z',
      pending: true,
    });

    getDocketEntryWorksheetsByDocketEntryIdsResults.push({
      docketEntryId: DOCKET_ENTRY_ID,
      finalBriefDueDate: 'SOME FINAL BRIEF DUE DATE',
      primaryIssue: 'SOME PRIMARY ISSUE',
      statusOfMatter: 'SOME STATUS OF MATTER',
    });

    CASE_BY_DOCKET_NUMBER[DOCKET_NUMBER] = {
      associatedJudge: 'Colvin',
      caseCaption: 'TEST_CASE_CAPTION',
      consolidatedCases: [],
      docketNumber: DOCKET_NUMBER,
      docketNumberWithSuffix: 'docketNumberWithSuffix',
      leadDocketNumber: DOCKET_NUMBER,
    };

    const EXPECTED_CONSOLIDATED_CASE = 999;
    applicationContext
      .getPersistenceGateway()
      .getConsolidatedCasesCount.mockResolvedValue(EXPECTED_CONSOLIDATED_CASE);

    const results =
      await getPendingMotionDocketEntriesForCurrentJudgeInteractor(
        applicationContext,
        {
          judges: ['Colvin'],
        },
      );

    expect(
      applicationContext.getPersistenceGateway()
        .getAllPendingMotionDocketEntriesForJudge.mock.calls[0][0].judges,
    ).toEqual(['Colvin']);

    expect(results.docketEntries.length).toEqual(1);

    const expectedDocketEntry: FormattedPendingMotionWithWorksheet = {
      caseCaption: 'TEST_CASE_CAPTION',
      consolidatedGroupCount: EXPECTED_CONSOLIDATED_CASE,
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
      docketEntryId: LEAD_DOCKET_ENTRY_ID,
      docketNumber: LEAD_DOCKET_NUMBER,
      eventCode: 'M218',
      filingDate: '2000-04-29T15:52:05.725Z',
      pending: true,
    });

    getAllPendingMotionDocketEntriesForJudgeResults.results.push({
      docketEntryId: LEAD_DOCKET_ENTRY_ID,
      docketNumber: DOCKET_NUMBER,
      eventCode: 'M218',
      filingDate: '2000-04-29T15:52:05.725Z',
      pending: true,
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
    applicationContext
      .getPersistenceGateway()
      .getDocketEntryOnCase.mockResolvedValue({
        docketEntryId: LEAD_DOCKET_ENTRY_ID,
        documentTitle: 'TEST_DOCUMENT_TITLE',
        eventCode: 'M218',
        filingDate: '2000-04-29T15:52:05.725Z',
        pending: true,
      });

    CASE_BY_DOCKET_NUMBER[DOCKET_NUMBER] = {
      caseCaption: 'TEST_CASE_CAPTION',
      consolidatedCases: [],
      docketNumber: DOCKET_NUMBER,
      leadDocketNumber: LEAD_DOCKET_NUMBER,
    };

    CASE_BY_DOCKET_NUMBER[LEAD_DOCKET_NUMBER] = {
      caseCaption: 'TEST_CASE_CAPTION',
      consolidatedCases: [],
      docketNumber: LEAD_DOCKET_NUMBER,
      leadDocketNumber: LEAD_DOCKET_NUMBER,
    };

    const results =
      await getPendingMotionDocketEntriesForCurrentJudgeInteractor(
        applicationContext,
        {
          judges: ['Colvin'],
        },
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
