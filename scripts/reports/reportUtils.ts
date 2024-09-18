export function parseInts(ints: string, delimiter = ','): number[] {
  let nums = ints
    .split(delimiter)
    .filter(s => s.length)
    .map(s => parseInt(s));
  return nums;
}

export function parseIntRange(intRange: string): number[] {
  const ints = intRange
    .split('-')
    .filter(s => s.length)
    .map(s => parseInt(s));
  const min = Math.min(...ints);
  const max = Math.max(...ints);
  let rangeNums: number[] = [];
  for (let i = min; i <= max; i++) {
    rangeNums.push(i);
  }
  return rangeNums;
}

// eslint-disable-next-line spellcheck/spell-checker
/**
 *
 * @param intstr a string containing an int (e.g. '1'), list of ints(e.g. '1,2,3'), or inclusive int range (e.g. '1-3')
 * @returns an array of one or more integers
 */
export function parseIntsArg(intstr: string): number[] {
  if (intstr.indexOf('-') > 0) {
    return parseIntRange(intstr);
  } else {
    return parseInts(intstr);
  }
}
