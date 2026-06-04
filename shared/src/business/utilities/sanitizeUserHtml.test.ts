import { sanitizeUserHtml } from './sanitizeUserHtml';

describe('sanitizeUserHtml', () => {
  it('returns an empty string for empty input', () => {
    expect(sanitizeUserHtml('')).toEqual('');
  });

  it('preserves the full set of Quill-produced order markup', () => {
    const quillHtml =
      '<p class="ql-indent-1" style="padding-left: 3em; white-space: pre-wrap">' +
      '<span style="font-size: 14px">' +
      '<strong>Hello</strong> <em>world</em> <u>!</u>' +
      '</span></p>' +
      '<ul><li>one</li><li>two</li></ul>' +
      '<ol><li>three</li></ol>' +
      '<p>plain<br />break</p>';

    const out = sanitizeUserHtml(quillHtml);

    expect(out).toContain('<strong>Hello</strong>');
    expect(out).toContain('<em>world</em>');
    expect(out).toContain('<u>!</u>');
    expect(out).toContain('<ul>');
    expect(out).toContain('<ol>');
    expect(out).toContain('<li>one</li>');
    expect(out).toContain('font-size: 14px');
    expect(out).toContain('padding-left: 3em');
    expect(out).toContain('white-space: pre-wrap');
    expect(out).toContain('ql-indent-1');
    expect(out).toMatch(/<br\s*\/?>/);
  });

  it('drops <script> elements and their contents', () => {
    const out = sanitizeUserHtml(
      '<p>before</p><script>alert(1)</script><p>after</p>',
    );
    expect(out).toEqual('<p>before</p><p>after</p>');
    expect(out).not.toContain('alert');
    expect(out).not.toContain('script');
  });

  it('drops <iframe>, <object>, <embed>, <link>, <meta>, <base>, <style>', () => {
    const out = sanitizeUserHtml(
      '<p>ok</p>' +
        '<iframe src="https://attacker.example"></iframe>' +
        '<object data="x"></object>' +
        '<embed src="x" />' +
        '<link rel="stylesheet" href="x" />' +
        '<meta http-equiv="refresh" content="0;url=x" />' +
        '<base href="https://attacker.example/" />' +
        '<style>body { background: url(javascript:alert(1)) }</style>',
    );
    expect(out).toEqual('<p>ok</p>');
  });

  it('strips on* event handler attributes from allowed elements', () => {
    const out = sanitizeUserHtml(
      '<p onclick="alert(1)" onmouseover="alert(2)">hi</p>',
    );
    expect(out).toEqual('<p>hi</p>');
    expect(out).not.toContain('onclick');
    expect(out).not.toContain('onmouseover');
  });

  it('strips href/src/action and other non-allowlisted attributes', () => {
    const out = sanitizeUserHtml(
      '<p data-evil="x" id="boom" title="t"><span href="javascript:alert(1)">x</span></p>',
    );
    expect(out).toEqual('<p><span>x</span></p>');
  });

  it('drops style declarations outside the allowlist', () => {
    const out = sanitizeUserHtml(
      '<p style="font-size: 12px; color: red; background: url(javascript:alert(1))">x</p>',
    );
    expect(out).toContain('font-size: 12px');
    expect(out).not.toContain('color');
    expect(out).not.toContain('background');
    expect(out).not.toContain('javascript');
  });

  it('drops a dangerous value from an otherwise-allowed style property', () => {
    const out = sanitizeUserHtml(
      '<p style="font-size: 12px; font-size: expression(alert(1))">x</p>',
    );
    expect(out).toContain('font-size: 12px');
    expect(out).not.toContain('expression');
    expect(out).not.toContain('alert');
  });

  it('drops a class attribute that does not match ql-indent-N', () => {
    const out = sanitizeUserHtml(
      '<p class="ql-indent-2 some-other-class evil">x</p>',
    );
    expect(out).toContain('class="ql-indent-2"');
    expect(out).not.toContain('some-other-class');
    expect(out).not.toContain('evil');
  });

  it('preserves the indent-paragraph class used for generated order indents', () => {
    const out = sanitizeUserHtml(
      '<p class="indent-paragraph">ORDERED that jurisdiction is retained by the undersigned.</p>',
    );
    expect(out).toContain('class="indent-paragraph"');
  });

  it('keeps indent-paragraph while still dropping disallowed sibling classes', () => {
    const out = sanitizeUserHtml(
      '<p class="indent-paragraph evil">x</p>',
    );
    expect(out).toContain('indent-paragraph');
    expect(out).not.toContain('evil');
  });

  it('drops disallowed elements with their entire subtree (not just the tag)', () => {
    const out = sanitizeUserHtml(
      '<div><p>kept</p><script>var x = "leaked text"</script></div>',
    );
    // The outer <div> is also disallowed, so the whole thing is dropped.
    expect(out).toEqual('');
    expect(out).not.toContain('leaked text');
  });

  it('survives malformed input without throwing', () => {
    expect(() =>
      sanitizeUserHtml('<p><strong>unclosed <em>nested </p> text'),
    ).not.toThrow();
  });
});
