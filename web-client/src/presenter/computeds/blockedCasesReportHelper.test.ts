import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { blockedCasesReportHelper } from './blockedCasesReportHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { initialBlockedCaseReportFilter } from '@web-client/presenter/state/blockedCasesReportState';
import { cloneDeep } from 'lodash';
import { BlockedCaseData } from '@web-api/persistence/postgres/cases/reports/getBlockedCasesForTrialLocation';
import { MOCK_CASE } from '@shared/test/mockCase';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';

describe('blockedCasesReportHelper', () => {
  const { DOCKET_NUMBER_SUFFIXES } = applicationContext.getConstants();
  let blockedCaseReportFilter: typeof initialBlockedCaseReportFilter;
  let blockedCasesState: BlockedCaseData[];

  beforeEach(() => {
    blockedCaseReportFilter = cloneDeep(initialBlockedCaseReportFilter);
    blockedCasesState = [];
  });

  describe('formatting', () => {
    it('formats blocked cases with caseTitle, docketNumberWithSuffix, and blockedDateFormatted and sorts by docket number', () => {
      const result = runCompute(blockedCasesReportHelper, {
        state: {
          blockedCaseReportFilter: {
            caseStatusFilter: 'All',
            reasonFilter: 'All',
          },
          blockedCases: [
            {
              blocked: true,
              blockedDate: '2019-03-01T21:42:29.073Z',
              caseCaption: 'Brett Osborne, Petitioner',
              docketNumber: '105-19',
              docketNumberWithSuffix: '105-19',
              leadDocketNumber: '102-19',
            },
            {
              automaticBlocked: true,
              automaticBlockedDate: '2018-03-05T21:42:29.073Z',
              blocked: true,
              blockedDate: '2019-07-01T21:42:29.073Z',
              caseCaption: 'Selma Horn & Cairo Harris, Petitioners',
              docketNumber: '102-19',
              docketNumberWithSuffix: '102-19',
              leadDocketNumber: '102-19',
            },
            {
              automaticBlocked: true,
              automaticBlockedDate: '2019-03-05T21:42:29.073Z',
              blocked: true,
              blockedDate: '2018-03-05T21:42:29.073Z',
              caseCaption:
                'Tatum Craig, Wayne Obrien, Partnership Representative, Petitioner(s)',
              docketNumber: '103-18',
              docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
              docketNumberWithSuffix: '103-18S',
            },
            {
              automaticBlocked: true,
              automaticBlockedDate: '2019-03-05T21:42:29.073Z',
              caseCaption: 'Bob Barker, Petitioner',
              docketNumber: '104-19',
              docketNumberWithSuffix: '104-19',
              leadDocketNumber: '102-19',
            },
            {
              automaticBlocked: false,
              caseCaption: 'Brett Osborne, Petitioner',
              docketNumber: '201-20',
              docketNumberWithSuffix: '105-19',
              leadDocketNumber: '102-19',
            },
            {
              automaticBlocked: false,
              caseCaption: 'Brett Osborne, Petitioner',
              docketNumber: '201-21',
              docketNumberWithSuffix: '105-19',
              leadDocketNumber: '102-19',
            },
          ],
        },
      });
      expect(result).toEqual({
        blockedCasesCount: 6,
        blockedCasesFormatted: [
          {
            automaticBlocked: true,
            automaticBlockedDate: '2019-03-05T21:42:29.073Z',
            blocked: true,
            blockedDate: '2018-03-05T21:42:29.073Z',
            blockedDateEarliest: '03/05/18',
            caseCaption:
              'Tatum Craig, Wayne Obrien, Partnership Representative, Petitioner(s)',
            caseTitle: 'Tatum Craig, Wayne Obrien, Partnership Representative',
            consolidatedIconTooltipText: '',
            docketNumber: '103-18',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
            docketNumberWithSuffix: '103-18S',
            inConsolidatedGroup: false,
            isLeadCase: false,
            shouldIndent: false,
          },
          {
            automaticBlocked: true,
            automaticBlockedDate: '2018-03-05T21:42:29.073Z',
            blocked: true,
            blockedDate: '2019-07-01T21:42:29.073Z',
            blockedDateEarliest: '03/05/18',
            caseCaption: 'Selma Horn & Cairo Harris, Petitioners',
            caseTitle: 'Selma Horn & Cairo Harris',
            consolidatedIconTooltipText: 'Lead case',
            docketNumber: '102-19',
            docketNumberWithSuffix: '102-19',
            inConsolidatedGroup: true,
            isLeadCase: true,
            leadDocketNumber: '102-19',
            shouldIndent: false,
          },
          {
            automaticBlocked: true,
            automaticBlockedDate: '2019-03-05T21:42:29.073Z',
            blockedDateEarliest: '03/05/19',
            caseCaption: 'Bob Barker, Petitioner',
            caseTitle: 'Bob Barker',
            consolidatedIconTooltipText: 'Consolidated case',
            docketNumber: '104-19',
            docketNumberWithSuffix: '104-19',
            inConsolidatedGroup: true,
            isLeadCase: false,
            leadDocketNumber: '102-19',
            shouldIndent: false,
          },
          {
            blocked: true,
            blockedDate: '2019-03-01T21:42:29.073Z',
            blockedDateEarliest: '03/01/19',
            caseCaption: 'Brett Osborne, Petitioner',
            caseTitle: 'Brett Osborne',
            consolidatedIconTooltipText: 'Consolidated case',
            docketNumber: '105-19',
            docketNumberWithSuffix: '105-19',
            inConsolidatedGroup: true,
            isLeadCase: false,
            leadDocketNumber: '102-19',
            shouldIndent: false,
          },
          {
            automaticBlocked: false,
            blockedDateEarliest: '03/05/18',
            blockedReason: 'Grouped with blocked case',
            caseCaption: 'Brett Osborne, Petitioner',
            caseTitle: 'Brett Osborne',
            consolidatedIconTooltipText: 'Consolidated case',
            docketNumber: '201-20',
            docketNumberWithSuffix: '105-19',
            inConsolidatedGroup: true,
            isLeadCase: false,
            leadDocketNumber: '102-19',
            shouldIndent: false,
          },
          {
            automaticBlocked: false,
            blockedDateEarliest: '03/05/18',
            blockedReason: 'Grouped with blocked case',
            caseCaption: 'Brett Osborne, Petitioner',
            caseTitle: 'Brett Osborne',
            consolidatedIconTooltipText: 'Consolidated case',
            docketNumber: '201-21',
            docketNumberWithSuffix: '105-19',
            inConsolidatedGroup: true,
            isLeadCase: false,
            leadDocketNumber: '102-19',
            shouldIndent: false,
          },
        ],
      });
    });

    it('should mark cases as "Grouped with blocked case" when they are in a consolidated group and are not directly blocked themselves', () => {
      const leadBlockedCase = cloneDeep(MOCK_CASE);
      leadBlockedCase.leadDocketNumber = MOCK_CASE.docketNumber;
      leadBlockedCase.blocked = true;
      leadBlockedCase.blockedReason = 'The judge says block';
      const groupedCase = cloneDeep(MOCK_CASE);
      groupedCase.leadDocketNumber = MOCK_CASE.leadDocketNumber;
      groupedCase.docketNumber = '107-25';
      blockedCasesState = [leadBlockedCase, groupedCase];

      const result = runCompute(blockedCasesReportHelper, {
        state: { blockedCaseReportFilter, blockedCases: blockedCasesState },
      });

      const formattedGroupedCase = result.blockedCasesFormatted.find(
        c => c.docketNumber === '107-25',
      );
      expect(formattedGroupedCase?.blockedReason).toEqual(
        'Grouped with blocked case',
      );
    });
  });

  describe('sorting', () => {
    it('should sort cases based on docket number and always keep consolidated groups together', () => {
      const cases = [
        { docketNumber: '999-23', leadDocketNumber: '101-10' },
        { docketNumber: '3247-19', leadDocketNumber: '232-19' },
        { docketNumber: '107-21' },
        { docketNumber: '232-19', leadDocketNumber: '232-19' },
        { docketNumber: '927-02' },
        { docketNumber: '101-10', leadDocketNumber: '101-10' },
        { docketNumber: '927-01' },
      ];

      const result = runCompute(blockedCasesReportHelper, {
        state: {
          blockedCaseReportFilter: {
            caseStatusFilter: 'All',
            procedureTypeFilter: undefined,
            reasonFilter: 'All',
          },
          blockedCases: cases,
        },
      });

      const expected = [
        { docketNumber: '927-01' },
        { docketNumber: '927-02' },
        { docketNumber: '101-10', leadDocketNumber: '101-10' },
        { docketNumber: '999-23', leadDocketNumber: '101-10' },
        { docketNumber: '232-19', leadDocketNumber: '232-19' },
        { docketNumber: '3247-19', leadDocketNumber: '232-19' },
        { docketNumber: '107-21' },
      ];
      expected.forEach((e, i) => {
        expect(e.docketNumber).toEqual(
          result.blockedCasesFormatted[i].docketNumber,
        );
        expect(e.leadDocketNumber).toEqual(
          result.blockedCasesFormatted[i].leadDocketNumber,
        );
      });
    });
  });

  describe('filters', () => {
    describe('caseStatusFilter', () => {
      it('should return all the blocked cases when "caseStatusFilter" is set to "All', () => {
        const TEST_CASES = [
          { docketNumber: '101-19' },
          { docketNumber: '102-19' },
          { docketNumber: '103-19' },
        ];

        const result = runCompute(blockedCasesReportHelper, {
          state: {
            blockedCaseReportFilter: {
              caseStatusFilter: 'All',
              reasonFilter: 'All',
            },
            blockedCases: TEST_CASES,
          },
        });
        expect(result.blockedCasesFormatted.length).toEqual(TEST_CASES.length);
      });

      it('should filter out blocked cases that do not match "caseStatusFilter"', () => {
        const TEST_STATUS = 'TEST_STATUS';
        const TEST_CASES = [
          { docketNumber: '101-19', status: 'RANDOM' },
          { docketNumber: '102-19', status: TEST_STATUS },
          { docketNumber: '103-19', status: 'RANDOM' },
        ];

        const result = runCompute(blockedCasesReportHelper, {
          state: {
            blockedCaseReportFilter: {
              caseStatusFilter: TEST_STATUS,
              reasonFilter: 'All',
            },
            blockedCases: TEST_CASES,
          },
        });

        expect(result.blockedCasesFormatted.length).toEqual(1);
        expect(result.blockedCasesFormatted[0]).toMatchObject({
          docketNumber: '102-19',
          status: TEST_STATUS,
        });
      });
    });

    describe('reasonFilter', () => {
      it('should return all the blocked cases when "reasonFilter" is set to "All', () => {
        const TEST_CASES = [
          { docketNumber: '101-19' },
          { docketNumber: '102-19' },
          { docketNumber: '103-19' },
        ];

        const result = runCompute(blockedCasesReportHelper, {
          state: {
            blockedCaseReportFilter: {
              caseStatusFilter: 'All',
              reasonFilter: 'All',
            },
            blockedCases: TEST_CASES,
          },
        });
        expect(result.blockedCasesFormatted.length).toEqual(TEST_CASES.length);
      });

      it('should filter out blocked cases that do not match "reasonFilter"', () => {
        const TEST_REASON = 'TEST_REASON';
        const TEST_CASES = [
          { automaticBlockedReason: 'RANDOM', docketNumber: '101-19' },
          { automaticBlockedReason: TEST_REASON, docketNumber: '102-19' },
          { automaticBlockedReason: 'RANDOM', docketNumber: '103-19' },
        ];

        const result = runCompute(blockedCasesReportHelper, {
          state: {
            blockedCaseReportFilter: {
              caseStatusFilter: 'All',
              reasonFilter: TEST_REASON,
            },
            blockedCases: TEST_CASES,
          },
        });

        expect(result.blockedCasesFormatted.length).toEqual(1);
        expect(result.blockedCasesFormatted[0]).toMatchObject({
          automaticBlockedReason: TEST_REASON,
          docketNumber: '102-19',
        });
      });

      it('should filter out blocked cases that do not have user added reason if "reasonFilter" is "Manual Block"', () => {
        const TEST_CASES = [
          {
            automaticBlocked: true,
            automaticBlockedReason: 'RANDOM',
            blockedReason: '',
            docketNumber: '101-19',
          },
          {
            automaticBlocked: true,
            automaticBlockedReason: 'RANDOM',
            blockedReason: 'RANDOM USER REASON',
            blocked: true,
            docketNumber: '102-19',
          },
          {
            automaticBlocked: true,
            automaticBlockedReason: 'RANDOM',
            blockedReason: '',
            docketNumber: '103-19',
          },
        ];

        const result = runCompute(blockedCasesReportHelper, {
          state: {
            blockedCaseReportFilter: {
              caseStatusFilter: 'All',
              reasonFilter: 'Manual Block',
            },
            blockedCases: TEST_CASES,
          },
        });

        expect(result.blockedCasesFormatted.length).toEqual(1);
        expect(result.blockedCasesFormatted[0]).toMatchObject({
          automaticBlockedReason: 'RANDOM',
          blockedReason: 'RANDOM USER REASON',
          docketNumber: '102-19',
        });
      });
    });

    describe('procedureType', () => {
      it('should return blocked regular cases when regular is selected', () => {
        const result = runCompute(blockedCasesReportHelper, {
          state: {
            blockedCaseReportFilter: {
              caseStatusFilter: 'All',
              procedureTypeFilter: 'Regular',
              reasonFilter: 'All',
            },
            blockedCases: [
              {
                blocked: true,
                blockedDate: '2019-03-01T21:42:29.073Z',
                caseCaption: 'Brett Osborne, Petitioner',
                docketNumber: '105-19',
                docketNumberWithSuffix: '105-19S',
                procedureType: 'Small',
              },
              {
                automaticBlocked: true,
                automaticBlockedDate: '2018-03-05T21:42:29.073Z',
                blocked: true,
                blockedDate: '2019-07-01T21:42:29.073Z',
                caseCaption: 'Selma Horn & Cairo Harris, Petitioners',
                docketNumber: '102-19',
                docketNumberWithSuffix: '102-19',
                procedureType: 'Regular',
              },
              {
                automaticBlocked: true,
                automaticBlockedDate: '2019-03-05T21:42:29.073Z',
                blocked: true,
                blockedDate: '2018-03-05T21:42:29.073Z',
                caseCaption:
                  'Tatum Craig, Wayne Obrien, Partnership Representative, Petitioner(s)',
                docketNumber: '103-18',
                docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
                docketNumberWithSuffix: '103-18S',
                procedureType: 'Small',
              },
              {
                automaticBlocked: true,
                automaticBlockedDate: '2019-03-05T21:42:29.073Z',
                caseCaption: 'Bob Barker, Petitioner',
                docketNumber: '104-19',
                docketNumberWithSuffix: '104-19',
                procedureType: 'Regular',
              },
            ],
          },
        });
        expect(result.blockedCasesCount).toBe(2);
        expect(result.blockedCasesFormatted).toMatchObject(
          expect.arrayContaining([
            expect.objectContaining({
              docketNumber: '102-19',
            }),
            expect.objectContaining({
              docketNumber: '104-19',
            }),
          ]),
        );
      });

      it('should return all cases if the procedureType is undefined', () => {
        const result = runCompute(blockedCasesReportHelper, {
          state: {
            blockedCaseReportFilter: {
              caseStatusFilter: 'All',
              procedureTypeFilter: undefined,
              reasonFilter: 'All',
            },
            blockedCases: [
              {
                blocked: true,
                blockedDate: '2019-03-01T21:42:29.073Z',
                caseCaption: 'Brett Osborne, Petitioner',
                docketNumber: '105-19',
                docketNumberWithSuffix: '105-19S',
                procedureType: 'Small',
              },
              {
                automaticBlocked: true,
                automaticBlockedDate: '2018-03-05T21:42:29.073Z',
                blocked: true,
                blockedDate: '2019-07-01T21:42:29.073Z',
                caseCaption: 'Selma Horn & Cairo Harris, Petitioners',
                docketNumber: '102-19',
                docketNumberWithSuffix: '102-19',
                procedureType: 'Regular',
              },
              {
                automaticBlocked: true,
                automaticBlockedDate: '2019-03-05T21:42:29.073Z',
                blocked: true,
                blockedDate: '2018-03-05T21:42:29.073Z',
                caseCaption:
                  'Tatum Craig, Wayne Obrien, Partnership Representative, Petitioner(s)',
                docketNumber: '103-18',
                docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
                docketNumberWithSuffix: '103-18S',
                procedureType: 'Small',
              },
              {
                automaticBlocked: true,
                automaticBlockedDate: '2019-03-05T21:42:29.073Z',
                caseCaption: 'Bob Barker, Petitioner',
                docketNumber: '104-19',
                docketNumberWithSuffix: '104-19',
                procedureType: 'Regular',
              },
            ],
          },
        });
        expect(result.blockedCasesCount).toEqual(4);
      });
    });

    describe('consolidated cases', () => {
      it('should keep the entire consolidated group of cases in the results when one of them matches the filter criteria', () => {
        const submittedFilter = CASE_STATUS_TYPES.submitted;
        blockedCaseReportFilter.caseStatusFilter = submittedFilter;
        const leadCase = cloneDeep(MOCK_CASE);
        leadCase.leadDocketNumber = leadCase.docketNumber;
        leadCase.blocked = true;
        leadCase.blockedReason = 'The judge says block';
        leadCase.status = CASE_STATUS_TYPES.cav;
        const groupedCase = cloneDeep(MOCK_CASE);
        groupedCase.leadDocketNumber = leadCase.docketNumber;
        groupedCase.docketNumber = '107-25';
        groupedCase.status = submittedFilter;
        const soloCase = cloneDeep(MOCK_CASE);
        soloCase.status = submittedFilter;
        soloCase.docketNumber = '584-24';
        blockedCasesState = [leadCase, soloCase, groupedCase];

        const result = runCompute(blockedCasesReportHelper, {
          state: { blockedCaseReportFilter, blockedCases: blockedCasesState },
        });

        expect(result.blockedCasesCount).toEqual(3);
      });
    });
  });
});
