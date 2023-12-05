import { RawDocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getPendingMotionDocketEntriesForCurrentJudgeInteractor } from '@shared/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
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
      .getCaseByDocketNumber.mockImplementation(
        ({ docketNumber }: { docketNumber: string }) => {
          return CASE_BY_DOCKET_NUMBER[docketNumber];
        },
      );

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
          judge: 'Colvin',
        },
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should return the single docket entry data for a pending motion ignoring non motions and thos not over 180 days', async () => {
    getAllPendingMotionDocketEntriesForJudgeResults.results.push({
      createdAt: '2000-04-29T15:52:05.725Z',
      docketEntryId: DOCKET_ENTRY_ID,
      docketNumber: DOCKET_NUMBER,
      eventCode: 'M218',
      pending: true,
    });

    getDocketEntryWorksheetsByDocketEntryIdsResults.push({
      docketEntryId: DOCKET_ENTRY_ID,
      finalBriefDueDate: 'SOME FINAL BRIEF DUE DATE',
      primaryIssue: 'SOME PRIMARY ISSUE',
      statusOfMatter: 'SOME STATUS OF MATTER',
    });

    CASE_BY_DOCKET_NUMBER[DOCKET_NUMBER] = {
      caseCaption: 'TEST_CASE_CAPTION',
      consolidatedCases: [],
      docketEntries: [
        {
          createdAt: '2000-04-29T15:52:05.725Z',
          docketEntryId: '123',
          eventCode: 'NOT A MOTION EVENT CODE',
          pending: true,
        },
        {
          createdAt: '2000-04-29T15:52:05.725Z',
          docketEntryId: DOCKET_ENTRY_ID,
          eventCode: 'M218',
          pending: true,
        },
        {
          createdAt: '3000-04-29T15:52:05.725Z',
          docketEntryId: '12345767',
          eventCode: 'M218',
          pending: true,
        },
      ],
    };

    const results =
      await getPendingMotionDocketEntriesForCurrentJudgeInteractor(
        applicationContext,
        {
          judge: 'Colvin',
        },
      );

    expect(results.docketEntries.length).toEqual(1);
    expect(results.docketEntries).toEqual([
      {
        caseCaption: 'TEST_CASE_CAPTION',
        consolidatedCases: [],
        consolidatedGroupCount: 1,
        createdAt: '2000-04-29T15:52:05.725Z',
        daysSinceCreated: 8607,
        docketEntries: [
          {
            createdAt: '2000-04-29T15:52:05.725Z',
            docketEntryId: '123',
            eventCode: 'NOT A MOTION EVENT CODE',
            pending: true,
          },
          {
            createdAt: '2000-04-29T15:52:05.725Z',
            docketEntryId: DOCKET_ENTRY_ID,
            eventCode: 'M218',
            pending: true,
          },
          {
            createdAt: '3000-04-29T15:52:05.725Z',
            docketEntryId: '12345767',
            eventCode: 'M218',
            pending: true,
          },
        ],
        docketEntryId: '1234-5678-9123-4567-8912',
        docketEntryWorksheet: {
          docketEntryId: '1234-5678-9123-4567-8912',
          finalBriefDueDate: 'SOME FINAL BRIEF DUE DATE',
          primaryIssue: 'SOME PRIMARY ISSUE',
          statusOfMatter: 'SOME STATUS OF MATTER',
        },
        docketNumber: DOCKET_NUMBER,
        eventCode: 'M218',
        pending: true,
      },
    ]);
  });

  it('should only return the lead case when a motion is mass sent using consolidated cases', async () => {
    getAllPendingMotionDocketEntriesForJudgeResults.results.push({
      createdAt: '2000-04-29T15:52:05.725Z',
      docketEntryId: LEAD_DOCKET_ENTRY_ID,
      docketNumber: DOCKET_NUMBER,
      eventCode: 'M218',
      leadDocketNumber: LEAD_DOCKET_NUMBER,
      pending: true,
    });

    getAllPendingMotionDocketEntriesForJudgeResults.results.push({
      createdAt: '2000-04-29T15:52:05.725Z',
      docketEntryId: LEAD_DOCKET_ENTRY_ID,
      docketNumber: LEAD_DOCKET_NUMBER,
      eventCode: 'M218',
      leadDocketNumber: LEAD_DOCKET_NUMBER,
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

    CASE_BY_DOCKET_NUMBER[DOCKET_NUMBER] = {
      caseCaption: 'TEST_CASE_CAPTION',
      consolidatedCases: [],
      docketEntries: [
        {
          createdAt: '2000-04-29T15:52:05.725Z',
          docketEntryId: '123',
          eventCode: 'NOT A MOTION EVENT CODE',
          pending: true,
        },
        {
          createdAt: '2000-04-29T15:52:05.725Z',
          docketEntryId: DOCKET_ENTRY_ID,
          eventCode: 'M218',
          pending: true,
        },
        {
          createdAt: '3000-04-29T15:52:05.725Z',
          docketEntryId: '12345767',
          eventCode: 'M218',
          pending: true,
        },
      ],
    };

    CASE_BY_DOCKET_NUMBER[LEAD_DOCKET_NUMBER] = {
      caseCaption: 'TEST_CASE_CAPTION',
      consolidatedCases: [],
      docketEntries: [
        {
          createdAt: '2000-04-29T15:52:05.725Z',
          docketEntryId: '123',
          eventCode: 'NOT A MOTION EVENT CODE',
          pending: true,
        },
        {
          createdAt: '2000-04-29T15:52:05.725Z',
          docketEntryId: LEAD_DOCKET_ENTRY_ID,
          eventCode: 'M218',
          pending: true,
        },
        {
          createdAt: '3000-04-29T15:52:05.725Z',
          docketEntryId: '12345767',
          eventCode: 'M218',
          pending: true,
        },
      ],
    };

    const results =
      await getPendingMotionDocketEntriesForCurrentJudgeInteractor(
        applicationContext,
        {
          judge: 'Colvin',
        },
      );

    expect(results.docketEntries.length).toEqual(1);
    expect(results.docketEntries).toEqual([
      {
        caseCaption: 'TEST_CASE_CAPTION',
        consolidatedCases: [],
        consolidatedGroupCount: 1,
        createdAt: '2000-04-29T15:52:05.725Z',
        daysSinceCreated: 8607,
        docketEntries: [
          {
            createdAt: '2000-04-29T15:52:05.725Z',
            docketEntryId: '123',
            eventCode: 'NOT A MOTION EVENT CODE',
            pending: true,
          },
          {
            createdAt: '2000-04-29T15:52:05.725Z',
            docketEntryId: LEAD_DOCKET_ENTRY_ID,
            eventCode: 'M218',
            pending: true,
          },
          {
            createdAt: '3000-04-29T15:52:05.725Z',
            docketEntryId: '12345767',
            eventCode: 'M218',
            pending: true,
          },
        ],
        docketEntryId: LEAD_DOCKET_ENTRY_ID,
        docketEntryWorksheet: {
          docketEntryId: LEAD_DOCKET_ENTRY_ID,
          finalBriefDueDate: 'LEAD SOME FINAL BRIEF DUE DATE',
          primaryIssue: 'LEAD SOME PRIMARY ISSUE',
          statusOfMatter: 'LEAD SOME STATUS OF MATTER',
        },
        docketNumber: LEAD_DOCKET_NUMBER,
        eventCode: 'M218',
        leadDocketNumber: LEAD_DOCKET_NUMBER,
        pending: true,
      },
    ]);
  });
});
