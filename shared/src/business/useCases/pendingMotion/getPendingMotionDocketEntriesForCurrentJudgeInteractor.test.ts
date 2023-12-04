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
  const DOCKET_ENTRY_ID = '1234-5678-9123-4567-8912';
  const getDocketNumbersByStatusAndByJudgeResults: any[] = [];
  const getDocketEntryWorksheetsByDocketEntryIdsResults: RawDocketEntryWorksheet[] =
    [];
  const CASE_BY_DOCKET_NUMBER: { [key: string]: any } = {};

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(judgeColvin);

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValue(
        getDocketNumbersByStatusAndByJudgeResults,
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
    getDocketNumbersByStatusAndByJudgeResults.push({
      docketNumber: DOCKET_NUMBER,
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
          docketEntryId: DOCKET_ENTRY_ID,
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
          docketEntryId: DOCKET_ENTRY_ID,
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
        consolidatedGroupCount: 1,
        createdAt: '2000-04-29T15:52:05.725Z',
        daysSinceCreated: 8607,
        docketEntryId: '1234-5678-9123-4567-8912',
        docketEntryWorksheet: {
          docketEntryId: '1234-5678-9123-4567-8912',
          entityName: 'RawDocketEntryWorksheet',
          finalBriefDueDate: 'SOME FINAL BRIEF DUE DATE',
          primaryIssue: 'SOME PRIMARY ISSUE',
          statusOfMatter: 'SOME STATUS OF MATTER',
        },
        eventCode: 'M218',
        leadDocketNumber: undefined,
        pending: true,
      },
    ]);
  });

  it('should only return the lead case when a motion is mass sent using consolidated cases', async () => {
    const MEMBER_DOCKET_NUMBER = '999-99';
    getDocketNumbersByStatusAndByJudgeResults.push({
      docketNumber: DOCKET_NUMBER,
    });

    getDocketEntryWorksheetsByDocketEntryIdsResults.push({
      docketEntryId: DOCKET_ENTRY_ID,
      finalBriefDueDate: 'SOME FINAL BRIEF DUE DATE',
      primaryIssue: 'SOME PRIMARY ISSUE',
      statusOfMatter: 'SOME STATUS OF MATTER',
    });

    CASE_BY_DOCKET_NUMBER[DOCKET_NUMBER] = {
      caseCaption: 'TEST_CASE_CAPTION',
      consolidatedCases: [{}, {}],
      docketEntries: [
        {
          createdAt: '2000-04-29T15:52:05.725Z',
          docketEntryId: DOCKET_ENTRY_ID,
          eventCode: 'M218',
          pending: true,
        },
      ],
      docketNumber: DOCKET_NUMBER,
      leadDocketNumber: DOCKET_NUMBER,
    };

    CASE_BY_DOCKET_NUMBER[MEMBER_DOCKET_NUMBER] = {
      caseCaption: 'TEST_CASE_CAPTION',
      consolidatedCases: [{}, {}],
      docketEntries: [
        {
          createdAt: '2000-04-29T15:52:05.725Z',
          docketEntryId: DOCKET_ENTRY_ID,
          eventCode: 'M218',
          pending: true,
        },
      ],
      docketNumber: MEMBER_DOCKET_NUMBER,
      leadDocketNumber: DOCKET_NUMBER,
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
        consolidatedGroupCount: 2,
        createdAt: '2000-04-29T15:52:05.725Z',
        daysSinceCreated: 8607,
        docketEntryId: '1234-5678-9123-4567-8912',
        docketEntryWorksheet: {
          docketEntryId: '1234-5678-9123-4567-8912',
          entityName: 'RawDocketEntryWorksheet',
          finalBriefDueDate: 'SOME FINAL BRIEF DUE DATE',
          primaryIssue: 'SOME PRIMARY ISSUE',
          statusOfMatter: 'SOME STATUS OF MATTER',
        },
        eventCode: 'M218',
        leadDocketNumber: '101-22',
        pending: true,
      },
    ]);
  });
});
