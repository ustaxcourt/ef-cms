import { buildHtmlTableDocument } from './buildHtmlTableDocument';

describe('buildHtmlTableDocument', () => {
  const parse = (html: string) =>
    new DOMParser().parseFromString(html, 'text/html');

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
    expect(
      Array.from(doc.querySelectorAll('tbody tr')).map(tr =>
        Array.from(tr.querySelectorAll('td')).map(td => td.textContent),
      ),
    ).toEqual([
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
