import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { caseWorksheetsHelper as caseWorksheetsHelperComputed } from './caseWorksheetsHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../withAppContext';

describe('caseWorksheetsHelper', () => {
  let baseState;
  let submittedAndCavCasesByJudge;

  const caseWorksheetsHelper = withAppContextDecorator(
    caseWorksheetsHelperComputed,
  );

  beforeEach(() => {
    submittedAndCavCasesByJudge = [
      {
        caseCaption: 'Scooby Doo, Petitioner',
        caseStatusHistory: [
          {
            date: '2002-02-15T05:00:00.000Z',
            updatedCaseStatus: CASE_STATUS_TYPES.generalDocket,
          },
          {
            date: '2002-02-16T05:00:00.000Z',
            updatedCaseStatus: CASE_STATUS_TYPES.submitted,
          },
        ],
        docketNumber: '101-20',
        formattedCaseCount: 1,
        leadDocketNumber: '101-20',
      },
      {
        caseCaption: 'Velma Jinkies, Petitioner',
        caseStatusHistory: [
          {
            date: '2022-02-15T05:00:00.000Z',
            updatedCaseStatus: CASE_STATUS_TYPES.generalDocket,
          },
          {
            date: '2022-02-26T05:00:00.000Z',
            updatedCaseStatus: CASE_STATUS_TYPES.submitted,
          },
        ],
        docketNumber: '110-15',
        formattedCaseCount: 0,
      },
      {
        caseCaption: 'Fred Dude, Petitioner',
        caseStatusHistory: [
          {
            date: '1987-02-06T05:00:00.000Z',
            updatedCaseStatus: CASE_STATUS_TYPES.generalDocket,
          },
          {
            date: '1987-02-15T05:00:00.000Z',
            updatedCaseStatus: CASE_STATUS_TYPES.cav,
          },
        ],
        docketNumber: '202-87',
        formattedCaseCount: 0,
      },
    ];

    baseState = {
      submittedAndCavCases: {
        submittedAndCavCasesByJudge,
        worksheets: [{ docketNumber: '110-15', primaryIssue: 'ZOINKS!' }],
      },
    };
  });

  it('should return caseWorksheetsFormatted with all appropriate data', () => {
    const { caseWorksheetsFormatted } = runCompute(caseWorksheetsHelper, {
      state: baseState,
    });

    const EXPECTED_FORMATTED_CASE_WORKSHEETS = [
      {
        caseCaption: 'Fred Dude, Petitioner',
        consolidatedIconTooltipText: '',
        daysSinceLastStatusChange: expect.anything(),
        docketNumber: '202-87',
        docketNumberWithSuffix: undefined,
        formattedCaseCount: 1,
        formattedSubmittedCavStatusDate: '02/15/87',
        inConsolidatedGroup: false,
        isLeadCase: false,
        status: undefined,
        worksheet: {},
      },
      {
        caseCaption: 'Scooby Doo, Petitioner',
        consolidatedIconTooltipText: 'Lead case',
        daysSinceLastStatusChange: expect.anything(),
        docketNumber: '101-20',
        docketNumberWithSuffix: undefined,
        formattedCaseCount: 1,
        formattedSubmittedCavStatusDate: '02/16/02',
        inConsolidatedGroup: true,
        isLeadCase: true,
        status: undefined,
        worksheet: {},
      },
      {
        caseCaption: 'Velma Jinkies, Petitioner',
        consolidatedIconTooltipText: '',
        daysSinceLastStatusChange: expect.anything(),
        docketNumber: '110-15',
        docketNumberWithSuffix: undefined,
        formattedCaseCount: 1,
        formattedSubmittedCavStatusDate: '02/26/22',
        inConsolidatedGroup: false,
        isLeadCase: false,
        status: undefined,
        worksheet: {
          docketNumber: '110-15',
          finalBriefDueDateFormatted: undefined,
          primaryIssue: 'ZOINKS!',
        },
      },
    ];
    const caseWithOlderStatusChange = caseWorksheetsFormatted.find(
      aCase => aCase.docketNumber === '101-20',
    );
    expect(caseWorksheetsFormatted).toEqual(EXPECTED_FORMATTED_CASE_WORKSHEETS);
    expect(
      `${caseWithOlderStatusChange!.daysSinceLastStatusChange}`.includes(','),
    ).toBeTruthy();
  });
});
