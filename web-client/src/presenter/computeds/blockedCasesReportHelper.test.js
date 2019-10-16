import { blockedCasesReportHelper as blockedCasesReportHelperComputed } from './blockedCasesReportHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const blockedCasesReportHelper = withAppContextDecorator(
  blockedCasesReportHelperComputed,
);

describe('blockedCasesReportHelper', () => {
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
        blockedCases: [{ caseId: '1' }, { caseId: '2' }, { caseId: '3' }],
      },
    });
    expect(result).toMatchObject({ blockedCasesCount: 3 });
  });

  it('formats blocked cases with caseName and docketNumberWithSuffix', () => {
    const result = runCompute(blockedCasesReportHelper, {
      state: {
        blockedCases: [
          {
            caseCaption: 'Brett Osborne, Petitioner',
            caseId: '1',
            docketNumber: '101-19',
          },
          {
            caseCaption: 'Selma Horn & Cairo Harris, Petitioners',
            caseId: '2',
            docketNumber: '102-19',
          },
          {
            caseCaption:
              'Tatum Craig, Wayne Obrien, Partnership Representative, Petitioner(s)',
            caseId: '3',
            docketNumber: '103-19',
            docketNumberSuffix: 'S',
          },
        ],
      },
    });
    expect(result).toEqual({
      blockedCasesCount: 3,
      blockedCasesFormatted: [
        {
          caseCaption: 'Brett Osborne, Petitioner',
          caseId: '1',
          caseName: 'Brett Osborne',
          docketNumber: '101-19',
          docketNumberWithSuffix: '101-19',
        },
        {
          caseCaption: 'Selma Horn & Cairo Harris, Petitioners',
          caseId: '2',
          caseName: 'Selma Horn & Cairo Harris',
          docketNumber: '102-19',
          docketNumberWithSuffix: '102-19',
        },
        {
          caseCaption:
            'Tatum Craig, Wayne Obrien, Partnership Representative, Petitioner(s)',
          caseId: '3',
          caseName: 'Tatum Craig, Wayne Obrien, Partnership Representative',
          docketNumber: '103-19',
          docketNumberSuffix: 'S',
          docketNumberWithSuffix: '103-19S',
        },
      ],
    });
  });
});
