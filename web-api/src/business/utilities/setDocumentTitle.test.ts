import { setDocumentTitle } from './setDocumentTitle';

describe('setDocumentTitle', () => {
  it('returns original title when stamp.disposition is falsy', () => {
    const title = 'Some Document Title';
    const stampData = {} as any;

    expect(setDocumentTitle(title, stampData)).toBe(title);
  });

  it('prepends "Order - " when disposition is present and title lacks prefix', () => {
    const title = 'Motion';
    const stampData = { disposition: 'GRANTED' } as any;

    expect(setDocumentTitle(title, stampData)).toBe('Order - Motion');
  });

  it('does not prepend when title already starts with "Order - "', () => {
    const title = 'Order - Motion DENIED';
    const stampData = { disposition: 'DENIED' } as any;

    expect(setDocumentTitle(title, stampData)).toBe(title);
  });
});
