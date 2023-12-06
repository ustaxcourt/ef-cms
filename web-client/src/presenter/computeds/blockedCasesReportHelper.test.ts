import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { blockedCasesReportHelper as blockedCasesReportHelperComputed } from './blockedCasesReportHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('blockedCasesReportHelper', () => {
  const { DOCKET_NUMBER_SUFFIXES } = applicationContext.getConstants();

  const blockedCasesReportHelper = withAppContextDecorator(
    blockedCasesReportHelperComputed,
  );

  const noBlockedCasesLocationMessage =
    'There are no blocked cases for this location.';
  const noBlockedCasesProcedureTypeMessage =
    'There are no blocked cases for this case type.';

  it('returns blockedCasesCount as 0 if blockedCases is not on the state', () => {
    const result = runCompute(blockedCasesReportHelper, {
      state: {},
    });
    expect(result).toMatchObject({ blockedCasesCount: 0 });
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
        form: {
          procedureType: 'All',
        },
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

  it('should return blocked small cases when small is selected', () => {
    const result = runCompute(blockedCasesReportHelper, {
      state: {
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
        form: { procedureType: 'Small' },
      },
    });
    expect(result.blockedCasesCount).toBe(2);
    expect(result.blockedCasesFormatted).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: '105-19',
        }),
        expect.objectContaining({
          docketNumber: '103-18',
        }),
      ]),
    );
  });

  it('should return blocked regular cases when regular is selected', () => {
    const result = runCompute(blockedCasesReportHelper, {
      state: {
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
        form: { procedureType: 'Regular' },
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
        form: { procedureType: undefined },
      },
    });
    expect(result.blockedCasesCount).toEqual(4);
  });

  it('should display correct display message when blockedCasesCount equals zero', () => {
    const result = runCompute(blockedCasesReportHelper, {
      state: {
        blockedCases: [],
        form: { procedureType: 'All' },
      },
    });
    expect(result.displayMessage).toEqual(noBlockedCasesLocationMessage);
  });

  it('should display correct display message when procedureType is set to Small and there are no Small Blocked Cases', () => {
    const result = runCompute(blockedCasesReportHelper, {
      state: {
        blockedCases: [
          {
            automaticBlocked: true,
            automaticBlockedDate: '2019-03-05T21:42:29.073Z',
            caseCaption: 'Bob Barker, Petitioner',
            docketNumber: '104-19',
            docketNumberWithSuffix: '104-19',
            procedureType: 'Regular',
          },
        ],
        form: { procedureType: 'Small' },
      },
    });
    expect(result.displayMessage).toEqual(noBlockedCasesProcedureTypeMessage);
  });

  it('should not display any message when procedureType is set to Regular and there are Regular Blocked Cases', () => {
    const result = runCompute(blockedCasesReportHelper, {
      state: {
        blockedCases: [
          {
            automaticBlocked: true,
            automaticBlockedDate: '2019-03-05T21:42:29.073Z',
            caseCaption: 'Bob Barker, Petitioner',
            docketNumber: '104-19',
            docketNumberWithSuffix: '104-19',
            procedureType: 'Regular',
          },
        ],
        form: { procedureType: 'Regular' },
      },
    });
    expect(result.displayMessage).toBeUndefined();
  });

  it('should not display any message when procedureType is set to All and there are Blocked Cases', () => {
    const result = runCompute(blockedCasesReportHelper, {
      state: {
        blockedCases: [
          {
            automaticBlocked: true,
            automaticBlockedDate: '2019-03-05T21:42:29.073Z',
            caseCaption: 'Bob Barker, Petitioner',
            docketNumber: '104-19',
            docketNumberWithSuffix: '104-19',
            procedureType: 'Regular',
          },
        ],
        form: { procedureType: 'All' },
      },
    });
    expect(result.displayMessage).toBeUndefined();
  });

  it('should not display any message when procedureType is not set on form and there are Blocked Cases', () => {
    const result = runCompute(blockedCasesReportHelper, {
      state: {
        blockedCases: [
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
    expect(result.displayMessage).toBeUndefined();
  });

  it('should display correct display message when procedureType is not on form and there are no Blocked Cases', () => {
    const result = runCompute(blockedCasesReportHelper, {
      state: {
        blockedCases: [],
      },
    });
    expect(result.displayMessage).toEqual(noBlockedCasesLocationMessage);
  });
});
