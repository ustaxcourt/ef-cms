import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { blockedCasesReportHelper } from './blockedCasesReportHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('blockedCasesReportHelper', () => {
  const { DOCKET_NUMBER_SUFFIXES } = applicationContext.getConstants();

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
          ],
        },
      });
      expect(result).toEqual({
        blockedCasesCount: 4,
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
        ],
      });
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
  });
});
