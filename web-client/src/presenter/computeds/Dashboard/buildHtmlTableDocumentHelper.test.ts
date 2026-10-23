import { CASE_TYPES } from '@shared/business/entities/EntityConstants';
import { ClerkDashboardCaseTypeTotal } from '@web-api/business/useCases/reports/getClerkDashboardStatsInteractor';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { buildHtmlTableDocumentHelper as buildHtmlTableDocumentHelperComputed } from './buildHtmlTableDocumentHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '@web-client/withAppContext';

const buildHtmlTableDocumentHelper = withAppContextDecorator(
  buildHtmlTableDocumentHelperComputed,
  { ...applicationContext },
);

describe('buildHtmlTableDocumentHelper', () => {
  const getOpenCasesByTypeTable = (
    openCasesByCaseType: ClerkDashboardCaseTypeTotal[],
  ) =>
    runCompute(buildHtmlTableDocumentHelper, {
      state: { clerkOfCourtDashboardStats: { openCasesByCaseType } },
    }).openCasesByTypeTable;

  it('should set the open cases by type table title and column headers', () => {
    const { labelHeader, title, totalHeader } = getOpenCasesByTypeTable([]);

    expect(title).toEqual('All Open Cases by Type');
    expect(labelHeader).toEqual('Type of Case');
    expect(totalHeader).toEqual('Total');
  });

  it('should list every case type, largest total first', () => {
    const { rows } = getOpenCasesByTypeTable([
      { caseType: 'Deficiency', total: 1798 },
      { caseType: 'Declaratory Judgment (Exempt Organization)', total: 51 },
      { caseType: 'Declaratory Judgment (Retirement Plan)', total: 75 },
      { caseType: 'Partnership (BBA Section 1101)', total: 26 },
      { caseType: 'Partnership (Section 6226)', total: 48 },
      { caseType: 'Partnership (Section 6228)', total: 75 },
      { caseType: 'Passport', total: 0 },
    ]);

    // equal totals keep the Deficiency-first case type order
    expect(rows).toEqual([
      { label: 'Deficiency', total: '1,798' },
      { label: 'Declaratory Judgment (Retirement Plan)', total: '75' },
      { label: 'Partnership (Section 6228)', total: '75' },
      { label: 'Declaratory Judgment (Exempt Organization)', total: '51' },
      { label: 'Partnership (Section 6226)', total: '48' },
      { label: 'Partnership (BBA Section 1101)', total: '26' },
      { label: 'CDP (Lien/Levy)', total: '0' },
      { label: 'Disclosure', total: '0' },
      { label: 'Innocent Spouse', total: '0' },
      { label: 'Interest Abatement', total: '0' },
      { label: 'Other', total: '0' },
      { label: 'Passport', total: '0' },
      { label: 'Whistleblower', total: '0' },
      { label: 'Worker Classification', total: '0' },
    ]);
  });

  it('should sort by the numeric total, not the formatted text', () => {
    const { rows } = getOpenCasesByTypeTable([
      { caseType: 'Other', total: 9 },
      { caseType: 'Passport', total: 1000 },
      { caseType: 'Disclosure', total: 100 },
    ]);

    expect(rows.slice(0, 3).map(row => row.label)).toEqual([
      'Passport',
      'Disclosure',
      'Other',
    ]);
  });

  it('should zero every case type when there are no open cases', () => {
    const { rows } = getOpenCasesByTypeTable([]);

    expect(rows).toHaveLength(CASE_TYPES.length);
    rows.forEach(row => {
      expect(row.total).toEqual('0');
    });
  });
});
