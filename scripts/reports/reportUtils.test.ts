import { parseIntRange, parseInts, parseIntsArg } from './reportUtils';

describe('parseIntsRange', () => {
  it('returns array when given valid ranges', () => {
    expect(parseIntRange('1-2')).toEqual([1, 2]);
    expect(parseIntRange('3-1')).toEqual([1, 2, 3]);
    expect(parseIntRange('1-3')).toEqual([1, 2, 3]);
    expect(parseIntRange('0-0')).toEqual([0]); // hoot!
    expect(parseIntRange('')).toEqual([]);
  });

  it('returns single item array when given single number', () => {
    expect(parseIntRange('1')).toEqual([1]);
  });

  it('returns empty array when given no valid input', () => {
    expect(parseIntRange('')).toEqual([]);
  });
});

describe('parseInts', () => {
  it('should return empty array when given empty input', () => {
    expect(parseInts('')).toEqual([]);
  });
  it('should ignore trailing comma', () => {
    expect(parseInts('1,')).toEqual([1]);
  });
  it('should return an array when given comma-delimited list', () => {
    expect(parseInts('1,2,3')).toEqual([1, 2, 3]);
  });
  it('should return an array when given tab-delimited list', () => {
    expect(parseInts('1\t2\t3', '\t')).toEqual([1, 2, 3]);
  });

  it('should return array of ints', () => {
    let ints = parseInts('1,2,3');
    expect(ints).toEqual([1, 2, 3]);
    ints.forEach(n => {
      expect(typeof n).toBe('number');
    });
  });
});

describe('parseIntsArg', () => {
  it('returns empty array when given empty input', () => {
    expect(parseIntsArg('')).toEqual([]);
  });
  it('handles int ranges', () => {
    expect(parseIntsArg('1-3')).toEqual([1, 2, 3]);
  });

  it('handles int lists', () => {
    expect(parseIntsArg('1,2,3')).toEqual([1, 2, 3]);
  });
});
