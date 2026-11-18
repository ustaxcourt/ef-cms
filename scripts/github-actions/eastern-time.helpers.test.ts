import { isoToMillis, toEasternTime } from './eastern-time.helpers';

describe('toEasternTime', () => {
  it.each([
    ['2026-07-13T11:55:00Z', '2026-07-13T07:55:00.000-04:00'],
    ['2026-11-16T12:55:00Z', '2026-11-16T07:55:00.000-05:00'],
  ])('converts %s to Eastern time', (iso, expected) => {
    expect(toEasternTime(iso).toISO()).toBe(expected);
  });

  it('throws on a value that is not an ISO date-time', () => {
    expect(() => toEasternTime('next Monday')).toThrow(
      'Expected an ISO date-time (got "next Monday")',
    );
  });
});

describe('isoToMillis', () => {
  it('reads the timestamp as UTC', () => {
    expect(isoToMillis('1970-01-01T00:00:01')).toBe(1000);
  });
});
