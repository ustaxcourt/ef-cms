import {
  buildHtmlTableDocument,
  buildHtmlTableDocumentHelper as buildHtmlTableDocumentHelperComputed,
} from './buildHtmlTableDocumentHelper';
import { CASE_TYPES } from '@shared/business/entities/EntityConstants';
import { ClerkDashboardCaseTypeTotal } from '@web-api/business/useCases/reports/getClerkDashboardStatsInteractor';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '@web-client/withAppContext';

const buildHtmlTableDocumentHelper = withAppContextDecorator(
  buildHtmlTableDocumentHelperComputed,
  { ...applicationContext },
);

const parse = (html: string) =>
  new DOMParser().parseFromString(html, 'text/html');

const getBodyRows = (doc: Document) =>
  Array.from(doc.querySelectorAll('tbody tr')).map(tr =>
    Array.from(tr.querySelectorAll('td')).map(td => td.textContent),
  );

describe('buildHtmlTableDocument', () => {
  it('should build a titled English document with a header row and one row per entry', () => {
    const doc = parse(
      buildHtmlTableDocument({
        labelHeader: 'Type of Case',
        rows: [
          { label: 'Deficiency', total: '2,058' },
          { label: 'CDP (Lien/Levy)', total: '87' },
        ],
        title: 'All Open Cases by Type',
        totalHeader: 'Total',
      }),
    );

    expect(doc.documentElement.lang).toEqual('en');
    expect(doc.title).toEqual('All Open Cases by Type');
    expect(doc.querySelector('h2')!.textContent).toEqual(
      'All Open Cases by Type',
    );
    expect(
      Array.from(doc.querySelectorAll('th')).map(th => th.textContent),
    ).toEqual(['Type of Case', 'Total']);
    expect(getBodyRows(doc)).toEqual([
      ['Deficiency', '2,058'],
      ['CDP (Lien/Levy)', '87'],
    ]);
  });

  it('should escape HTML in the title, headers, and rows', () => {
    const html = buildHtmlTableDocument({
      labelHeader: '<b>Type</b>',
      rows: [{ label: '<script>alert(1)</script>', total: '1 & 2' }],
      title: 'A "quoted" <title>',
      totalHeader: 'Total',
    });
    const doc = parse(html);

    expect(html).not.toContain('<script>');
    expect(doc.querySelector('script')).toBeNull();
    expect(doc.querySelector('th')!.textContent).toEqual('<b>Type</b>');
    expect(doc.querySelector('td')!.textContent).toEqual(
      '<script>alert(1)</script>',
    );
    expect(doc.querySelectorAll('td')[1].textContent).toEqual('1 & 2');
    expect(doc.title).toEqual('A "quoted" <title>');
  });

  it('should build an empty table body when there are no rows', () => {
    const doc = parse(
      buildHtmlTableDocument({
        labelHeader: 'Type of Case',
        rows: [],
        title: 'Empty',
        totalHeader: 'Total',
      }),
    );

    expect(doc.querySelectorAll('tbody tr')).toHaveLength(0);
  });
});

describe('buildHtmlTableDocumentHelper', () => {
  const getOpenCasesByTypeDocument = (
    openCasesByCaseType: ClerkDashboardCaseTypeTotal[],
  ) =>
    parse(
      runCompute(buildHtmlTableDocumentHelper, {
        state: { clerkOfCourtDashboardStats: { openCasesByCaseType } },
      }).openCasesByTypeHtmlDocument,
    );

  it('should title the open cases by type document and its columns', () => {
    const doc = getOpenCasesByTypeDocument([]);

    expect(doc.title).toEqual('All Open Cases by Type');
    expect(
      Array.from(doc.querySelectorAll('th')).map(th => th.textContent),
    ).toEqual(['Type of Case', 'Total']);
  });

  it('should list every case type, largest total first', () => {
    const doc = getOpenCasesByTypeDocument([
      { caseType: 'Deficiency', total: 1798 },
      { caseType: 'Declaratory Judgment (Exempt Organization)', total: 51 },
      { caseType: 'Declaratory Judgment (Retirement Plan)', total: 75 },
      { caseType: 'Partnership (BBA Section 1101)', total: 26 },
      { caseType: 'Partnership (Section 6226)', total: 48 },
      { caseType: 'Partnership (Section 6228)', total: 75 },
      { caseType: 'Passport', total: 0 },
    ]);

    // equal totals keep the Deficiency-first case type order
    expect(getBodyRows(doc)).toEqual([
      ['Deficiency', '1,798'],
      ['Declaratory Judgment (Retirement Plan)', '75'],
      ['Partnership (Section 6228)', '75'],
      ['Declaratory Judgment (Exempt Organization)', '51'],
      ['Partnership (Section 6226)', '48'],
      ['Partnership (BBA Section 1101)', '26'],
      ['CDP (Lien/Levy)', '0'],
      ['Disclosure', '0'],
      ['Innocent Spouse', '0'],
      ['Interest Abatement', '0'],
      ['Other', '0'],
      ['Passport', '0'],
      ['Whistleblower', '0'],
      ['Worker Classification', '0'],
    ]);
  });

  it('should sort by the numeric total, not the formatted text', () => {
    const doc = getOpenCasesByTypeDocument([
      { caseType: 'Other', total: 9 },
      { caseType: 'Passport', total: 1000 },
      { caseType: 'Disclosure', total: 100 },
    ]);

    expect(
      getBodyRows(doc)
        .slice(0, 3)
        .map(([label]) => label),
    ).toEqual(['Passport', 'Disclosure', 'Other']);
  });

  it('should zero every case type when there are no open cases', () => {
    const rows = getBodyRows(getOpenCasesByTypeDocument([]));

    expect(rows).toHaveLength(CASE_TYPES.length);
    rows.forEach(([, total]) => {
      expect(total).toEqual('0');
    });
  });
});
