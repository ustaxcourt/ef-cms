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
        status: CASE_STATUS_TYPES.submitted,
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
        caseWorksheet: { docketNumber: '110-15', primaryIssue: 'ZOINKS!' },
        docketNumber: '110-15',
        formattedCaseCount: 1,
        status: CASE_STATUS_TYPES.submitted,
      },
      {
        caseCaption: 'Fred Dude, Petitioner',
        caseStatusHistory: [
          {
            date: '1987-02-04T05:00:00.000Z',
            updatedCaseStatus: CASE_STATUS_TYPES.generalDocket,
          },
          {
            date: '1987-02-15T05:00:00.000Z',
            updatedCaseStatus: CASE_STATUS_TYPES.cav,
          },
        ],
        docketNumber: '202-87',
        formattedCaseCount: 1,
        status: CASE_STATUS_TYPES.cav,
      },
      {
        caseCaption: 'Shaggy Guy, Petitioner',
        caseStatusHistory: [
          {
            date: '2022-02-15T05:00:00.000Z',
            updatedCaseStatus: CASE_STATUS_TYPES.generalDocket,
          },
          {
            date: '2022-02-16T05:00:00.000Z',
            updatedCaseStatus: CASE_STATUS_TYPES.submittedRule122,
          },
        ],
        docketNumber: '303-11',
        formattedCaseCount: 1,
        status: CASE_STATUS_TYPES.submittedRule122,
      },
    ];

    baseState = {
      submittedAndCavCases: {
        submittedAndCavCasesByJudge,
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
        finalBriefDueDateFormatted: '',
        formattedCaseCount: 1,
        formattedSubmittedCavStatusDate: '02/15/87',
        inConsolidatedGroup: false,
        isLeadCase: false,
        status: CASE_STATUS_TYPES.cav,
        worksheet: undefined,
      },
      {
        caseCaption: 'Scooby Doo, Petitioner',
        consolidatedIconTooltipText: 'Lead case',
        daysSinceLastStatusChange: expect.anything(),
        docketNumber: '101-20',
        docketNumberWithSuffix: undefined,
        finalBriefDueDateFormatted: '',
        formattedCaseCount: 1,
        formattedSubmittedCavStatusDate: '02/16/02',
        inConsolidatedGroup: true,
        isLeadCase: true,
        status: CASE_STATUS_TYPES.submitted,
        worksheet: undefined,
      },
      {
        caseCaption: 'Shaggy Guy, Petitioner',
        consolidatedIconTooltipText: '',
        daysSinceLastStatusChange: expect.anything(),
        docketNumber: '303-11',
        docketNumberWithSuffix: undefined,
        finalBriefDueDateFormatted: '',
        formattedCaseCount: 1,
        formattedSubmittedCavStatusDate: '02/16/22',
        inConsolidatedGroup: false,
        isLeadCase: false,
        status: CASE_STATUS_TYPES.submittedRule122,
        worksheet: undefined,
      },
      {
        caseCaption: 'Velma Jinkies, Petitioner',
        consolidatedIconTooltipText: '',
        daysSinceLastStatusChange: expect.anything(),
        docketNumber: '110-15',
        docketNumberWithSuffix: undefined,
        finalBriefDueDateFormatted: '',
        formattedCaseCount: 1,
        formattedSubmittedCavStatusDate: '02/26/22',
        inConsolidatedGroup: false,
        isLeadCase: false,
        status: CASE_STATUS_TYPES.submitted,
        worksheet: {
          docketNumber: '110-15',
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
