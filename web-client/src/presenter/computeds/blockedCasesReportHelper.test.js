import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { blockedCasesReportHelper as blockedCasesReportHelperComputed } from './blockedCasesReportHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('blockedCasesReportHelper', () => {
  const { DOCKET_NUMBER_SUFFIXES } = applicationContext.getConstants();

  const blockedCasesReportHelper = withAppContextDecorator(
    blockedCasesReportHelperComputed,
  );
  it('returns blockedCasesCount as undefined if blockedCases is not on the state', () => {
    const result = runCompute(blockedCasesReportHelper, {
      state: {},
    });
    expect(result).toMatchObject({ blockedCasesCount: undefined });
  });

  it('returns blockedCasesCount as 0 if the blockedCases array is empty', () => {
    const result = runCompute(blockedCasesReportHelper, {
      state: {
        blockedCases: [],
      },
    });
    expect(result).toMatchObject({ blockedCasesCount: 0 });
  });

  it('returns blockedCasesCount as the length of the blockedCases array', () => {
    const result = runCompute(blockedCasesReportHelper, {
      state: {
        blockedCases: [
          { docketNumber: '101-19' },
          { docketNumber: '102-19' },
          { docketNumber: '103-19' },
        ],
      },
    });
    expect(result).toMatchObject({ blockedCasesCount: 3 });
  });

  it('formats blocked cases with caseTitle, docketNumberWithSuffix, and blockedDateFormatted and sorts by docket number', () => {
    const result = runCompute(blockedCasesReportHelper, {
      state: {
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
          consolidatedIconTooltipText: null,
          docketNumber: '103-18',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          docketNumberWithSuffix: '103-18S',
          inConsolidatedGroup: false,
          inLeadCase: false,
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
          inLeadCase: true,
          leadDocketNumber: '102-19',
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
          inLeadCase: false,
          leadDocketNumber: '102-19',
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
          inLeadCase: false,
          leadDocketNumber: '102-19',
        },
      ],
    });
  });
});
